const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { Orders, Order_Diffuser, Order_Oil } = require('../../models/diffusers');
const diffuserCartServices = require('../../services/diffuser_cart_services');
const oilCartServices = require('../../services/oil_cart_services');
const customerDataLayer = require('../../dal/users');
const orderDataLayer = require('../../dal/orders');
const cartDataLayer = require('../../dal/cart')

// display individual customers orders 
// display both diffusers & oils products
router.get('/:customer_id', async (req, res) => {
    try {
        let allDiffusers, allOils;
        const customer = await customerDataLayer.getCustomer(req.params.customer_id);
        const diffuserService = new diffuserCartServices(customer.get('id'));
        allDiffusers = await diffuserService.getAllDiffusers();
        const oilService = new oilCartServices(customer.get('id'));
        allOils = await oilService.getAllOils()

        res.status(200);
        res.send({
            "diffuserItems": allDiffusers,
            "oilItems": allOils
        })
    } catch (e) {
        res.status(404);
        res.send("Customer not found")
    }

})

// get customer's lateest orders
router.get('/:customer_id/latest/orders', async (req, res) => {
    // to include oil items as well
    try {
        let custLatestOrder = await orderDataLayer.getOrdersByCustomerId(req.params.customer_id);
        res.status(200);
        res.send(custLatestOrder)
    } catch (e) {
        res.status(404);
        res.send("Latest order not found")
    }
})

// when customer clicks on a decides to confirm the purchase
// create an order instance for the vendor
router.post('/:customer_id/latest/orders', async (req, res) => {
    let customerOrder = new Orders();

    let customer_id = req.params.customer_id;
    let streetName = req.body.street_name;
    let postalCode = req.body.postal_code;
    let unitCode = req.body.unit_code;

    customerOrder.set('customer_id', customer_id),
        customerOrder.set('street_name', streetName),
        customerOrder.set('postal_code', postalCode),
        customerOrder.set('unit_code', unitCode),
        customerOrder.set('amount', 0),
        customerOrder.set('payment_status', 'unpaid'),
        customerOrder.set('order_status', 'pending'),
        customerOrder.set('payment_type', 'card')
    customerOrder.set('order_date', new Date())

    await customerOrder.save();
    res.send("Successfully added shipping order address");
})

// create an instance of all diffuser/oil products from customers' cart
// for vendor to see what product is needed
router.get('/:customer_id/orders', async (req, res) => {
    try {
        let allCustDiffusers = await cartDataLayer.getAllDiffusers(req.params.customer_id);
        let allCustOils = await cartDataLayer.getAllOils(req.params.customer_id);
        let orderItemByCustomer = await orderDataLayer.getOrdersByCustomerId(req.params.customer_id);
        
        if (orderItemByCustomer) {
            console.log("CUstomer exists")
            if (allCustDiffusers.length > 0) {
                console.log("customer purchased diffusers");
                for (let diffuser of allCustDiffusers) {
                    // console.log(diffuser)
                    let diffuserOrderItem = new Order_Diffuser();
                    diffuserOrderItem.set('diffuser_id', diffuser.get('diffuser_id'));
                    diffuserOrderItem.set('quantity', diffuser.get('quantity'));
                    diffuserOrderItem.set('order_id', orderItemByCustomer.get('id'));
                    diffuserOrderItem.save();
                }
            }
            if (allCustOils.length > 0) {
                console.log("Customer purchased oils");
                for (let oil of allCustOils) {
                    let oilOrderItem = new Order_Oil();
                    oilOrderItem.set('oil_id', oil.get('oil_id'));
                    oilOrderItem.set('quantity', oil.get('quantity'));
                    oilOrderItem.set('order_id', orderItemByCustomer.get('id'));
                    oilOrderItem.save();
                };
            }
            res.status(200);
            res.send("OK")
        }
    } catch (e) {
        res.status(404);
        res.send("Not found")
    }
})



// last stage to redirect to Stripes'
// this route will show the Stripes checkout page
// see parallel lab: link checkout/checkout
router.get('/confirm', async (req, res) => {
    let allDiffusers, allOils;
    const customer = await customerDataLayer.getCustomer(req.params.customer_id);
    const diffuserService = new diffuserCartServices(customer.get('id'));
    allDiffusers = await diffuserService.getAllDiffusers();
    const oilService = new oilCartServices(customer.get('id'));
    allOils = await oilService.getAllOils()

    res.send({
        "diffuserItems": allDiffusers,
        "oilItems": allOils
    })

    let lineItems = [];
    let meta = [];

    // console.log(allDiffusers.toJSON(), allOils.toJSON())
    if (allDiffusers.length > 0) {
        for (let diffuserItem of allDiffusers) {
            diffuserLineItem = {
                'name': diffuserItem.related('diffusers').get('diffuser_name'),
                'amount': diffuserItem.related('diffusers').get('cost'),
                'quantity': diffuserItem.get('quantity'),
                'currency': 'SGD'
            }

            if (diffuserItem.related('diffusers').get('image_url')) {
                diffuserLineItem.images = [diffuserItem.related('diffusers').get('image_url')]
            }

            lineItems.push(diffuserLineItem);
            meta.push({
                'diffuser_id': diffuserItem.get('diffuser_id'),
                'quantity': diffuserItem.get('quantity')
            })
        }
    }

    if (allOils.length > 0) {
        for (let oilItem of allOils) {
            oilLineItem = {
                'name': oilItem.related('oils').get('name'),
                'amount': oilItem.related('oils').get('cost'),
                'quantity': oilItem.get('quantity'),
                'currency': 'SGD'
            }

            if (oilItem.related('oils').get('image_url')) {
                oilLineItem.images = [oilItem.related('oils').get('image_url')]
            }
            lineItems.push(oilLineItem);
            meta.push({
                'oil_id': oilItem.get('oil_id'),
                'quantity': oilItem.get('quantity')
            })

        }
    }
    console.log("All cart Items: ", lineItems);
    console.log("meta: ", meta)


    // META DATA should incude customer identification
    let metaJSON = JSON.stringify(meta);

    const payment = {
        'payment_method_types': ['card'],
        'line_items': lineItems,
        'success_url': process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        'cancel_url': process.env.STRIPE_ERROR_URL,
        'metadata': {
            'orders': metaData
        }

    }

})




module.exports = router;