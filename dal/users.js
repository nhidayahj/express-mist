const {User, Role, Member}  = require('../models/diffusers');

const getAllVendors = async() => {
    return await User.collection().fetch({
        require:false,
        withRelated:['roles']
    })
}

const getAllRoles = async() => {
    const allRoles = await Role.fetchAll().map((r)=> {
        return [r.get('id'), r.get('role')]
    })
    return allRoles;
}

const getCustomer = async(customerId) => {
    const customer = await Member.where({
        'id':customerId
    }).fetch({
        require:true,
    });
    return customer;
}

const getCustomerByEmail = async(custEmail) => {
    const customer = await Member.where({
        email:custEmail
    }).fetch({
        require:false,
    })
    return customer;
}




module.exports = {getAllRoles, getAllVendors, getCustomer
                ,getCustomerByEmail}