const express = require('express');
const router = express.Router();

const cartDataLayer = require('../../dal/cart');
const customerDataLayer = require('../../dal/users');

router.get('/:customer_id', async (req, res) => {
    try {
        let customer = await customerDataLayer.getCustomer(req.params.customer_id);
        res.status(200);
        res.send(customer);
    } catch (e) {
        res.status(404);
        res.send("Customer not found")
    }
})

// route for only when customer first joined and need to fill in 
// shipping address before checkout
router.post('/:customer_id', async (req, res) => {
    const allDiffusers = await cartDataLayer.getAllDiffusers(req.params.customer_id)
    const allOils = await cartDataLayer.getAllOils(req.params.customer_id)
    const custAdd = new MemberAddress();

    let customer_id = req.params.customer_id;
    let streetName = req.body.street_name;
    let postalCode = req.body.postal_code;
    let unitCode = req.body.unit_code;

        custAdd.set('customer_id', customer_id),
        custAdd.set('street_name', streetName),
        custAdd.set('postal_code', postalCode),
        custAdd.set('unit_code', unitCode),
        custAdd.set('amount', 0),
        custAdd.set('paymanet_status', 'unpaid'),
        custAdd.set('payment_type', 'card')


        await custAdd.save();
    res.send("Successfully added shipping address");
})

// get the stored shipping address
router.get('/:customer_id/address/update', async (req, res) => {
    const custAddress = await customerDataLayer.getCustomerAddress(req.params.customer_id);
    res.send(custAddress)
})

// this route is when customer wishes to update prevously stored shipping address
router.post('/:customer_id/address/update', async (req, res) => {
    const custAddress = await customerDataLayer.getCustomerAddress(req.params.customer_id);
    if (custAddress) {
        let streetName = req.body.street_name;
        let blkNum = req.body.blk_num;
        let postalCode = req.body.postal_code;
        let unitCode = req.body.unit_code;
        let customer_id = req.params.customer_id;

        custAdd.set('customer_id', customer_id),
            custAdd.set('street_name', streetName),
            custAdd.set('blk_num', blkNum),
            custAdd.set('postal_code', postalCode),
            custAdd.set('unit_code', unitCode),

            await custAdd.save();
        res.send("Successfully added shipping address");
    }

})





module.exports = router