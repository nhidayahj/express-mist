const {Orders, Member, Order_Diffuser, Order_Oil, DiffuserCartItem} = require('../models/diffusers');

const getAllCustomers = async() => {
    return await Member.collection().fetch({
        require:false
    })
}

// get customer from shipping orders table
const getCustomerOrderById = async(orderId) => {
    return await Orders.where({
        'id':orderId,
    }).fetch({
        require:false,
        withRelated:['customers']
    })
}


const getCustomerByEmail = async (customerEmail) => {
    const customer = await Member.where({
        'email':customerEmail
    }).fetch({
        require:false,
        withRelated:['orders']
    })
    return customer;
}

// latest order by the same customer
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

const getAllOrderedDiffuserByCustomer = async(customerId, orderId) => {
    const order = await getLatestOrdersByCustomerId(customerId);
    if(order) {
        const diffuserItems = await Order_Diffuser.collection().where({
            'order_id':orderId
        }).fetch({
            require:false,
            withRelated:['diffuser','orders']
        })
        return diffuserItems;
    }
}

const getAllOrderedOilByCustomer = async(customerId, orderId) => {
    const order = await getLatestOrdersByCustomerId(customerId);
    if (order) {
        const oilItems = await Order_Oil.collection().where({
            'order_id':orderId
        }).fetch({
            require:false,
            withRelated:['oil', 'orders']
        })
        return oilItems;
    }
}


const getPaymentStatusByOrderId = async(orderId) => {
    const customer = await getCustomerOrderById(orderId)
    // return customer;
    if (customer) {
        return await customer.get('payment_status')
    }
    
}

const updatePaymentOrderStatus = async(customerId, status, amount) => {
    const customer = await getLatestOrdersByCustomerId(customerId);
    if (customer) {
        
        customer.set('payment_status', status);
        customer.set('amount', amount);
        await customer.save();
        return customer;
    } 
    return null;
}


module.exports = {getAllCustomers, getCustomerOrderById, getCustomerByEmail,
    getAllOrderedDiffuserByCustomer, getAllOrderedOilByCustomer,
    getLatestOrdersByCustomerId, getPaymentStatusByOrderId, updatePaymentOrderStatus}