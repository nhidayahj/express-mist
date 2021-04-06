const bookshelf = require('../bookshelf');

// create an instance of the model 
// model instance == one row in the table 

const Diffuser = bookshelf.model('Diffuser', {
    tableName:'diffusers',
    category(){
        return this.belongsTo('Diffuser_Category')
    }
})

const Diffuser_Category = bookshelf.model('Diffuser_Category', {
    tableName:'diffuser_category',
    diffuser() {
        return this.hasMany('Diffuser')
    }
})

module.exports = {Diffuser, Diffuser_Category}