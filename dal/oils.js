const { Oils, Sizes, Oil_Tag } = require('../models/diffusers');


const getAllOils = async () => {
    return await Oils.collection().fetch({
        require: false,
        withRelated: ['sizes', 'tags']
    })
}

const getOilById = async (oilId) => {
    const oil = await Oils.where({
        'id': oilId
    }).fetch({
        require: false,
        withRelated: ['sizes', 'tags']
    })
    return oil;
}

const getAllSizes = async () => {
    const allSizes = await Sizes.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')]
    })
    return allSizes;
}

const getAllTags = async () => {
    const allTags = await Oil_Tag.fetchAll().map((t) => {
        return [t.get('id'), t.get('name')]
    })
    return allTags;
}

const getIndivSize = async (volumeId) => {
    const size = await Sizes.where({
        id: volumeId
    }).fetch({
        require: false,
        withRelated: ['oils']
    })
    return size
}

const getOilByName = async (name) => {
    const oil = await Oils.where({
        name: name, '%'
    }).fetchAll({
        require: false,
        withRelated: ['sizes', 'tags']
    })
    return oil;
}



module.exports = {
    getAllOils, getAllSizes, getAllTags
    , getOilById, getIndivSize, getOilByName
}