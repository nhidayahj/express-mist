const express = require('express');
const router = express.Router()

const userDataLayer = require('../../dal/users');
const cartDataLayer = require('../../dal/cart');
const DiffuserCartServices = require('../../services/diffuser_cart_services');
const OilCartServices = require('../../services/oil_cart_services');


// get all cart items from an individual customer
router.get('/:customer_id', async(req,res)=>{

    try {
        // checks if customer is registered
        let customer = await userDataLayer.getCustomer(req.params.customer_id);
        // then takes the customer's id
        let allDiffusers = await cartDataLayer.getAllDiffusers(customer.get('id'));
        let allOils = await cartDataLayer.getAllOils(customer.get('id'));
        res.status(200);
        res.send({
            "diffusers":allDiffusers,
            "oils":allOils
        });
    } catch (e) {
        res.status(404);
        res.send({
            'error':"Customer not found."
        })
        console.log(e)
    }
})

// customer to add diffuser into their own shopping cart
router.get('/diffuser/:customer_id/:diffuser_id/addtocart', async(req,res) => {
    let customer = await userDataLayer.getCustomer(req.params.customer_id);
        // then takes the customer's id
        let cartService = new DiffuserCartServices(customer.get('id'));
        let addedItem = await cartService.diffuserAddToCart(req.params.diffuser_id);
        
        res.status(200);
        res.send(addedItem);




    // try {
    //     // checks if customer is registered
    //     let customer = await userDataLayer.getCustomer(req.params.customer_id);
    //     // then takes the customer's id
    //     let cartService = new DiffuserCartServices(customer.get('id'));
    //     let addedItem = await cartService.diffuserAddToCart(req.params.diffuser_id);
        
    //     res.status(200);
    //     res.send(addedItem);
    // } catch (e) {
    //     res.status(404);
    //     res.send({
    //         'error':"Trouble adding diffuser to cart. Either customer or product not found"
    //     });
    //     console.log(e)
    // }
})

router.get('/diffuser/:customer_id/:diffuser_id/:newQuantity/update', async(req,res) => {
    try {
        // checks if customer is registered
        let customer = await userDataLayer.getCustomer(req.params.customer_id);
        // then takes the customer's id
        let cartServices = new DiffuserCartServices(customer.get('id'));
        let newQty = await cartServices.diffuserUpdateQuantity(req.params.diffuser_id, req.params.newQuantity);
        res.status(200);
        res.send(newQty)
    } catch (e) {
        res.status(404);
        res.send({
            "error":"Invalid quantity value"
        })
    }
})

router.get('/diffuser/:customer_id/:diffuser_id/remove', async(req,res) => {
    try {
        let cartService = new DiffuserCartServices(req.params.customer_id);
        await cartService.removeDiffuserItem(req.params.diffuser_id);
        res.status(200);
        res.send("Diffuser successfully deleted")
    } catch (e) {
        res.status(404);
        res.send({
            'error':"Trouble removing item from cart"
        })
        console.log(e)
    }
})


// customer to add oil into their cart
router.get('/oil/:customer_id/:oil_id/addtocart', async(req,res) => {
    try {
        // checks if customer is registered
        let customer = await userDataLayer.getCustomer(req.params.customer_id);
        // then takes the customer's id
        let cartServices = new OilCartServices(customer.get('id'));
        await cartServices.addOilToCart(req.params.oil_id);
        res.status(200);
        res.send({
            "success":"Successfully added oil to cart."
            
        })
    } catch (e) {
        res.status(404);
        res.send({
            'error':"Trouble adding oil to cart."
        })
        console.log(e)
    }
})

router.get('/oil/:customer_id/:oil_id/:newQuantity/update', async(req,res) => {
    try {
        // checks if customer is registered
        let customer = await userDataLayer.getCustomer(req.params.customer_id);
        // then takes the customer's id
        let cartServices = new OilCartServices(customer.get('id'));
        await cartServices.oilUpdateQuantity(req.params.oil_id, req.params.newQuantity);
        res.status(200);
        res.send("Oil quantity has been updated")
    } catch (e) {
        res.status(404);
        res.send({
            "error":"Invalid quantity value"
        })
    }
})


router.get('/oil/:customer_id/:oil_id/remove', async (req,res) => {
    try {
        let cartService = new OilCartServices(req.params.customer_id);
        await cartService.removeOil(req.params.oil_id);
        res.status(200);
        res.send("Oil product successfully deleted")
    } catch (e) {
        res.status(404);
        res.send({
            'error':"Trouble removing item from cart"
        })
        console.log(e)
    }
})





module.exports = router;