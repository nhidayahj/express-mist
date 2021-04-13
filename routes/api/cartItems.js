const express = require('express');
const router = express.Router()

const {Member} = require('../../models/diffusers')
const cartDataLayer = require('../../dal/cart')
const DiffuserCartServices = require('../../services/diffuser_cart_services');
const OilCartServices = require('../../services/oil_cart_services')


// get all cart items from an individual customer
router.get('/:customer_id', async(req,res)=>{
    // let customer = await cartDataLayer.getMemberById(req.params.member_id);
    let allDiffusers = await cartDataLayer.getAllDiffusers(req.params.customer_id);
    let allOils = await cartDataLayer.getAllOils(req.params.customer_id);
    res.send({
        allDiffusers,
        allOils
    });
})

// customer to add diffuser into their own shopping cart
router.get('/diffuser/:customer_id/:diffuser_id/addtocart', async(req,res) => {
    let cartService = new DiffuserCartServices(req.params.customer_id);
    let newCartItem = await cartService.diffuserAddToCart(req.params.diffuser_id);
    res.send({
        "customer":newCartItem.get('customer_id'),
        "diffuser":newCartItem.get("diffuser_id"),
        "quantity":newCartItem.get('quantity')
    });
})

// customer to add oil into their cart
router.get('/oil/:customer_id/:oil_id/addtocart', async(req,res) => {
    let cartServices = new OilCartServices(req.params.customer_id);
    let newCartItem = await cartServices.addOilToCart(req.params.oil_id);
    res.send({
        "customer":newCartItem.get('customer_id'),
        "oil":newCartItem.get("oil_id"),
        "quantity":newCartItem.get('quantity')
    })
})


router.get('/:customer_id/:diffuser_id/remove', async(req,res) => {
    let cartService = new DiffuserCartServices(req.params.customer_id);
    let removeDiffuser = await cartService.removeDiffuserItem(req.params.diffuser_id);
    res.send("Diffuser successfully deleted")
})





module.exports = router;