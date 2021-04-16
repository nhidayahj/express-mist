const bookshelf = require('../bookshelf');

// create an instance of the model 
// model instance == one row in the table 

const Diffuser = bookshelf.model('Diffuser', {
    tableName:'diffusers',
    category() {
        return this.belongsTo('Diffuser_Category', 'category_id')
    }, 
    tags() {
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

const DiffuserCartItem = bookshelf.model('DiffuserCartItem', {
    tableName:'diffuser_cart_items',
    diffusers() {
        return this.belongsTo('Diffuser')
    },
    customers() {
        return this.belongsTo('Member')
    }
})

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

const OilCartItem = bookshelf.model('OilCartItem', {
    tableName:'oil_cart_items',
    oils() {
        return this.belongsTo('Oils')
    },
    customers() {
        return this.belongsTo('Member')
    }
})

// User here refers to the Vendors
const User = bookshelf.model('User', {
    tableName:'users_vendors',
    roles() {
        return this.belongsTo('Role', 'role_id')
    }
})

// Role for the Vendors
const Role = bookshelf.model('Role', {
    tableName:'vendors_roles',
    user() {
        return this.hasMany('User')
    }
})


const Member = bookshelf.model('Member', {
    tableName:'users_customers',
    orders() {
        return this.belongsTo('Orders', 'order_id')
    }
    
})

const Orders = bookshelf.model('Orders', {
    tableName:'ship_orders', 
    customers() {
        return this.belongsTo('Member','customer_id')
    }
})

const Order_Diffuser = bookshelf.model('Order_Diffuser', {
    tableName:'orders_diffusers',
    orders() {
        return this.belongsTo('Orders', 'order_id')
    },
    diffuser() {
        return this.belongsTo('Diffuser', 'diffuser_id')
    }
})

const Order_Oil = bookshelf.model('Order_Oil', {
    tableName:'orders_oils', 
    orders() {
        return this.belongsTo('Orders', 'order_id')
    },
    oil() {
        return this.belongsTo('Oil','oil_id')
    }
})


module.exports = {Diffuser, Diffuser_Category, Diffuser_Tag, DiffuserCartItem, 
                    Oils, Sizes, Oil_Tag,OilCartItem, 
                    User, Role, Member, Orders, Order_Diffuser, Order_Oil}