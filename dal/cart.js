// this cart DAL will contain both diffusers & oils function

const {DiffuserCartItem, Member} = require('../models/diffusers')


const getMemberById = async (memberId) => {
    const member = await Member.where({
        'id':memberId
    }).fetch({
        require:false
    })
    return member;
}


const getAllDiffusers = async (memberId) => {
    const allDiffusers = await DiffuserCartItem.collection().where({
        'customer_id':memberId
    }).fetch({
        require:false,
        withRelated:['diffusers']
    })
    return allDiffusers;
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
                getDiffuserByUserAndDiffuserId, removeDiffuser}