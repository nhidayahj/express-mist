// routes to allow vendors to view customer's cart items 
const express = require('express');
const router = express.Router();
const util = require('util');

const { Orders, Order_Diffuser, Order_Oil } = require('../models/diffusers')

const ordersDataLayer = require('../dal/orders');
const { bootstrapField, orderSearchFields } = require('../forms/searchField')
const { checkIfAuthenticated } = require('../middleware')

router.get('/', async (req, res) => {
    const orderFormFields = orderSearchFields();

    let orderDiffuser = await Order_Diffuser.collection();
    let orderOil = await Order_Oil.collection();
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
    const customer = await ordersDataLayer.getLatestOrdersByCustomerId(req.params.customer_id)

    const orderedDiffuser = await ordersDataLayer
        .getAllOrderedDiffuserByCustomer(req.params.customer_id, req.params.order_id);

    const orderedOil = await ordersDataLayer
        .getAllOrderedOilByCustomer(req.params.customer_id, req.params.order_id);

    // res.send({
    //     // 'items':orderedItems,
    //     'diffuser':orderedDiffuser, 
    //     'oil': orderedOil,
    //     'customer':customer
    // });

    res.render("orders/customerOrders", {
        'diffuser': orderedDiffuser.toJSON(),
        'oil': orderedOil.toJSON(),
        'customer': customer.toJSON(),
    })
})


module.exports = router;

