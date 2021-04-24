const {Diffuser, Diffuser_Category, Diffuser_Tag} = require('../models/diffusers')


const getAllDiffuser = async() => {
    return await Diffuser.collection().fetch({
        require:false,
        withRelated:['category', 'tags']
    });
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
        withRelated:['category','tags']
    })
    return diffuser;
}

const getDiffuserByCategory = async(categoryId) => {
    const diffuserCat = await Diffuser
        .where({
            'category_id':categoryId
        }).fetch({
            require:false,
            withRelated:['category', 'tags']
        })
    return diffuserCat;
}

const getDiffByLT = async(range) => {
    const diffPrice = await Diffuser.collection()
        .query('where', 'cost', '<=', parseInt(range))
        .fetch({
            require:false,
            withRelated:['category', 'tags']
        })
    return diffPrice
}

const getDiffByMT = async(range) => {
    const diffPrice = await Diffuser.collection()
        .query('where', 'cost', '>=', parseInt(range))
        .fetch({
            require:false,
            withRelated:['category', 'tags']
        })
    return diffPrice
}

// const getDiffByPriceRange = async(range) => {
//     const diffPrice = await Diffuser.query({
//         where:{'cost': parseInt(range)}
//     }).fetchAll({
//         require:false,
//         withRelated:['category', 'tags']
//     })
//     return diffPrice;
// }



module.exports = {getAllDiffuser,getDiffuserById,
                getAllCategory, getAllTags,getDiffuserByCategory
                ,getDiffByLT, getDiffByMT}