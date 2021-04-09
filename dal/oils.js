const {Oils, Sizes, Oil_Tag} = require('../models/oils');


const getAllOils = async() => {
    return await Oils.collection().fetch({
        require:false,
        withRelated:['sizes', 'tags']
    })
}

const getAllSizes = async() => {
    const allSizes = await Sizes.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')]
    })
    return allSizes;
}

const getAllTags = async() => {
    const allTags = await Oil_Tag.fetchAll().map((t) =>{
        return [t.get('id'), t.get('name')]
    })
    return allTags;
}



module.exports = {getAllOils, getAllSizes, getAllTags}