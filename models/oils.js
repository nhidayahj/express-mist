const bookshelf = require('../bookshelf')


const Oils = bookshelf.model('Oils', {
    tableName:'oils', 
    sizes() {
        return this.belongsToMany('Sizes')
    }, 
    tags() {
        return this.belongsToMany('Oil_Tag', 'oils_oil_tags', 'oil_id')
    }
})

const Sizes = bookshelf.model('Sizes', {
    tableName:'sizes',
    oils(){
        return this.belongsToMany('Oils')
    }

})

const Oil_Tag = bookshelf.model('Oil_Tag',{
    tableName:'oil_tags',
    oils() {
        return this.belongsToMany('Oils', 'oils_oil_tags', 'oil_tag_id')
    }
})

module.exports = {Oils, Sizes, Oil_Tag}