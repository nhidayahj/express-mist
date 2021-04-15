const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const {Orders} = require('../../models/diffusers');
const diffuserCartServices = require('../../services/diffuser_cart_services');
const oilCartServices = require('../../services/oil_cart_services');
const customerDataLayer = require('../../dal/users');


router.get('/:customer_id', async(req,res) => {
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

// create an order instance for the vendor
// when customer clicks on a button
router.post('/:customer_id/orders', async(req,res) => {
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
        customerOrder.set('payment_type', 'card')

        await customerOrder.save();
    res.send("Successfully added shipping order address");
})

router.get('/:customer_id/diffuser/orders', async(req,res) => {

})

router.get('/:customer_id/oil/orders', async(req,res) => {
    
})


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

            if(diffuserItem.related('diffusers').get('image_url')) {
                diffuserLineItem.images = [diffuserItem.related('diffusers').get('image_url')]
            }
            
            lineItems.push(diffuserLineItem);
            meta.push({
                'diffuser_id':diffuserItem.get('diffuser_id'),
                'quantity':diffuserItem.get('quantity')
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

            if(oilItem.related('oils').get('image_url')) {
                oilLineItem.images = [oilItem.related('oils').get('image_url')]
            }
            lineItems.push(oilLineItem);
            meta.push({
                'oil_id':oilItem.get('oil_id'),
                'quantity':oilItem.get('quantity')
            })
            
        }
    }
    console.log("All cart Items: ", lineItems);
    console.log("meta: ",meta)


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