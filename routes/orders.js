// routes to allow vendors to view customer's cart items 
const express = require('express');
const router = express.Router();

const {Orders, Order_Diffuser, Order_Oil} = require('../models/diffusers')

const ordersDataLayer = require('../dal/orders')
const {bootstrapField, orderFields} = require('../forms/searchField')


router.get('/', async(req,res) => {
    const orderFormFields = orderFields();
    let orderDiffuser = await Order_Diffuser.collection();
    
    orderFormFields.handle(req, {
        'empty':async(form) => {
            let item = await orderDiffuser.fetch({
                withRelated:['orders', 'diffuser', "orders.customers"]
                
            });
            // res.send(item);
            res.render('orders/orders', {
                'order':item.toJSON(),
                'form':form.toHTML(bootstrapField)
            })
        }
    })
    

})



module.exports = router;

