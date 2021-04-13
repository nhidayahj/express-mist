const {User, Role}  = require('../models/diffusers');

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


module.exports = {getAllRoles, getAllVendors}