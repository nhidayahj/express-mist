const {Diffuser, Diffuser_Category, Diffuser_Tag} = require('../models')


const getAllDiffuser = async() => {
    return await Diffuser.fetchAll()
}
const getAllCategory = async() => {
    const allCategory = await Diffuser_Category
        .fetchAll().map((c) => {
            return [c.get('id'), c.get('name')]
        })
    return allCategory;
}

const getAllTags = async() => {
    const allTags = await Diffuser_Tag.fetchAll().map((t) => {
        return [t.get('id'), t.get('name')]
    });
    return allTags;
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

module.exports = {getAllDiffuser,getDiffuserById,
                getAllCategory, getAllTags}