const {Diffuser, Diffuser_Category} = require('../models')


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


module.exports = {getAllDiffuser, getAllCategory }