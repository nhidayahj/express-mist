const {Orders, Member, Order_Diffuser, DiffuserCartItem} = require('../models/diffusers');

const getAllCustomers = async() => {
    return await Member.collection().fetch({
        require:false
    })
}

const getCustomerById = async (customerId) => {
    const customer = await Member.where({
        'id':customerId
    }).fetch({
        require:true,
        withRelated:['orders']
    })
    return customer;
}

const getAllOrdersByCustomerId = async(customerId) => {
    const order = await getCustomerById(customerId);
    if(order) {
        const customerOrders = await Orders.where({
            'customer_id':customerId
        }).fetch({
            require:false,
            withRelated:['customers']
        })
        return customerOrders;
    }
}

const getLatestOrdersByCustomerId = async(customerId) => {
    return await Orders.where({
        'customer_id':customerId
    }).query(function(order){
        order.orderBy('id', 'DESC').limit(1)
    }).fetch({
        require:true,
        withRelated:['customers'] 
    })
}



module.exports = {getAllCustomers, getCustomerById,
    getAllOrdersByCustomerId, getLatestOrdersByCustomerId}