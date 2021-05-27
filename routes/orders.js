// routes to allow vendors to view customer's cart items 
const express = require('express');
const router = express.Router();


const { Orders, Order_Diffuser, Order_Oil } = require('../models/diffusers')

const ordersDataLayer = require('../dal/orders');
const { bootstrapField, orderSearchFields } = require('../forms/searchField')
const { checkIfAuthenticated } = require('../middleware')

router.get('/', async (req, res) => {
    
    let orderDiffuser = await Order_Diffuser.collection();
    let orderOil = await Order_Oil.collection();
    
    let pay_status_table = {
        '0':'Unpaid',
        '1':'Paid'
    }
    
    let order_status_table = {
        '0': 'In-Transit',
        '1':'Completed'
    }
    const orderFormFields = orderSearchFields(pay_status_table, order_status_table);
    
    orderFormFields.handle(req, {
        'empty': async (form) => {
            let diffuserOrder = await orderDiffuser.fetch({
                withRelated: ['orders', 'diffuser', "orders.customers"]
            });
            let oilOrder = await orderOil.fetch({
                withRelated: ['orders', 'oil', "orders.customers"]
            })
            // res.send({
            //     'order':latestOrders.toJSON(),
            //     'diffuser':diffuserOrder.toJSON(),
            //     oil:oilOrder.toJSON()
            // })
            res.render('orders/orders', {

                'diffuser': diffuserOrder.toJSON(),
                'oil': oilOrder.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
            let diffuserOrder = await orderDiffuser.fetch({
                withRelated: ['orders', 'diffuser', "orders.customers"]
            });
            let oilOrder = await orderOil.fetch({
                withRelated: ['orders', 'oil', "orders.customers"]
            })
            req.flash("error_messages", "No results found.")
            res.render('orders/orders', {
                'diffuser': diffuserOrder.toJSON(),
                'oil': oilOrder.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            if (form.data.order_id) {
                orderDiffuser = orderDiffuser.where('order_id', req.query.order_id);
                orderOil = orderOil.where('order_id', req.query.order_id);
            }

            if (form.data.payment_status) {
                orderDiffuser = orderDiffuser
                    .query('join', 'ship_orders', 'order_id', 'ship_orders.id')
                    .where('ship_orders.payment_status', '=', req.query.payment_status)
                orderOil = orderOil
                    .query('join', 'ship_orders', 'order_id', 'ship_orders.id')
                    .where('ship_orders.payment_status', '=', req.query.payment_status)
            }

            if (form.data.order_status) {
                orderDiffuser = orderDiffuser
                    .query('join', 'ship_orders', 'order_id', 'ship_orders.id')
                    .where('ship_orders.order_status', '=', req.query.order_status);
                orderOil = orderOil
                    .query('join', 'ship_orders', 'order_id', 'ship_orders.id')
                    .where('ship_orders.order_status', '=', req.query.order_status)
            }

            let searchDiffuser = await orderDiffuser.fetch({
                withRelated: ['orders', 'diffuser', 'orders.customers']
            })

            let searchOil = await orderOil.fetch({
                withRelated: ['orders', 'oil', 'orders.customers']
            })

            res.render('orders/orders', {
                'form': form.toHTML(bootstrapField),
                'diffuser': searchDiffuser.toJSON(),
                'oil': searchOil.toJSON()
            })
        }
    })


})

// get indv customer order details
router.get('/customerItems/:customer_id/:order_id', checkIfAuthenticated, async (req, res) => {
    const order = await ordersDataLayer.getCustomerOrderById(req.params.order_id)

    const orderedDiffuser = await ordersDataLayer
        .getAllOrderedDiffuserByCustomer(req.params.customer_id, req.params.order_id);

    const orderedOil = await ordersDataLayer
        .getAllOrderedOilByCustomer(req.params.customer_id, req.params.order_id);

    const paymentStatus = await ordersDataLayer.getPaymentStatusByOrderId(req.params.order_id);

    // res.send({

    //     'diffuser':orderedDiffuser, 
    //     'oil': orderedOil,
    //     'order':order
    // });

    res.render("orders/customerOrders", {
        'diffuser': orderedDiffuser.toJSON(),
        'oil': orderedOil.toJSON(),
        'order': order.toJSON(),
        'paymentStatus': paymentStatus
    })
})

// update PAID orders to either 'transit' or completed
router.post('/customerItems/:customer_id/:order_id', checkIfAuthenticated, async (req, res) => {
    try {
        const order = await ordersDataLayer.getCustomerOrderById(req.params.order_id);
        if (order) {
            order.set('order_status', req.body.order_status);
            await order.save()
        }
        req.flash("success_messages", `Order No. #${req.params.order_id} order status has been updated.`)
        res.status(200);
        res.redirect('back')
    } catch (e) {
        res.status(500);
        res.send("Error updating status");
    }
})

// get order ID to remove
router.get('/customerItems/:customer_id/:order_id/remove', checkIfAuthenticated, async (req, res) => {
    const order = await ordersDataLayer.getCustomerOrderById(req.params.order_id);

    const orderedDiffuser = await ordersDataLayer
        .getAllOrderedDiffuserByCustomer(req.params.customer_id, req.params.order_id);
    const orderedOil = await ordersDataLayer
        .getAllOrderedOilByCustomer(req.params.customer_id, req.params.order_id);

    // res.send({
    //     'order': order,
    //     'diffuser': orderedDiffuser,
    //     'oil': orderedOil
    // })

    res.render('orders/delete', {
        'order': order.toJSON(),
        'diffuser': orderedDiffuser.toJSON(),
        'oil': orderedOil.toJSON()
    })
})

router.post('/customerItems/:customer_id/:order_id/remove',checkIfAuthenticated, async(req,res) => {
    const order = await ordersDataLayer.getCustomerOrderById(req.params.order_id);
    let orderId = order.get('id')
    await order.destroy();
    req.flash("success_messages", `Successfully deleted Order No. #${orderId}.`);
    res.redirect('/orders')

})


module.exports = router;

