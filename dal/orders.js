const {Orders, Order_Diffuser, DiffuserCartItem} = require('../models/diffusers');

const getOrdersByCustomerId = async(customerId) => {
    return await Orders.where({
        'customer_id':customerId
    }).query(function(order){
        order.orderBy('id', 'DESC').limit(1)
    }).fetch({
        require:true, 
    })
}



module.exports = {getOrdersByCustomerId}