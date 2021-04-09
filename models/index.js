const bookshelf = require('../bookshelf');

// create an instance of the model 
// model instance == one row in the table 

const Diffuser = bookshelf.model('Diffuser', {
    tableName:'diffusers',
    category() {
        return this.belongsTo('Diffuser_Category', 'category_id')
    }, 
    tags() {
        // to confirm the migrtation mappings
        return this.belongsToMany('Diffuser_Tag', 'diffusers_diffuser_tags', 'diffuser_id')
    }
    
})

const Diffuser_Category = bookshelf.model('Diffuser_Category', {
    tableName:'diffuser_category',
    diffuser() {
        return this.hasMany('Diffuser')
    }
})

const Diffuser_Tag = bookshelf.model('Diffuser_Tag', {
    tableName:'diffuser_tags', 
    diffuser() {
        return this.belongsToMany('Diffuser')
    }
})

const Oils = bookshelf.model('Oils', {
    tableName:'oils', 
    sizes() {
        return this.belongsToMany('Sizes')
    }
})

const Sizes = bookshelf.model('Sizes', {
    tableName:'sizes',
    oils(){
        return this.belongsToMany('Oils')
    }

})



module.exports = {Diffuser, Diffuser_Category, Diffuser_Tag, Oils, Sizes}