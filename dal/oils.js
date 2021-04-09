const {Oils, Sizes} = require('../models');


const getAllOils = async() => {
    return await Oils.collection().fetchAll({
        require:false,
        withRelated:['sizes']
    })
}

const getAllSizes = async() => {
    const allSizes = await Sizes.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')]
    })
    return allSizes;
}

module.exports = {getAllOils, getAllSizes}