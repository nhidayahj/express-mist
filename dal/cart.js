// this cart DAL will contain both diffusers & oils function

const {DiffuserCartItem, OilCartItem, Member} = require('../models/diffusers')


const getMemberById = async (memberId) => {
    const member = await Member.where({
        'id':memberId
    }).fetch({
        require:false
    })
    return member;
}


const getAllDiffusers = async (customerId) => {
    const allDiffusers = await DiffuserCartItem.collection().where({
        'customer_id':customerId
    }).fetch({
        require:false,
        withRelated:['diffusers']
    })
    return allDiffusers;
}

const getAllOils = async(customerId) => {
    const allOils =  await OilCartItem.collection().where({
        'customer_id':customerId
    }).fetch({
        require:false,
        withRelated:['oils']
    });
    return allOils;
}

const getDiffuserByUserAndDiffuserId = async(userId, diffuserId) => {
    const diffuser = await DiffuserCartItem.where({
        'customer_id':userId,
        'diffuser_id':diffuserId
    }).fetch({
        require:false,
        withRelated:['diffusers']
    })
    return diffuser;
}

const getOilByUserAndOilId = async(userId, oilId) => {
    const oil = await OilCartItem.where({
        'customer_id':userId,
        'oil_id':oilId
    }).fetch({
        require:false,
        withRelated:['oils']
    });
    return oil;
}

const removeDiffuser = async(userId, diffuserId) => {
    const diffuser = await getDiffuserByUserAndDiffuserId(userId, diffuserId);
    if (diffuser) {
        diffuser.destroy();
        return true;
    }
    return false;

}

// allow customer to update quantity



module.exports = {getMemberById, getAllDiffusers, 
                getDiffuserByUserAndDiffuserId, removeDiffuser,
                getAllOils, getOilByUserAndOilId}