const {Diffuser, Diffuser_Category} = require('../models')


const getAllDiffuser = async() => {
    // return await Diffuser.fetchAll()
    return await Diffuser.collection().fetch({
        withRelated:['category']
    })
}
const getAllCategory = async() => {
    const allCategory = await Diffuser_Category
        .fetchAll().map((c) => {
            return [c.get('id'), c.get('name')]
        })
    return allCategory;
}

const getDiffuserById = async(diffuserId) => {
    const diffuser = await Diffuser.where({
        'id':diffuserId
    }).fetch({
        require:true,
        withRelated:['category']
    })
    return diffuser;
}

module.exports = {getAllDiffuser, getAllCategory,getDiffuserById}