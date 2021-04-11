const bookshelf = require('../bookshelf');

const User = bookshelf.model('User', {
    tableName:'users_vendors',
    roles() {
        return this.belongsTo('Role', 'role_id')
    }
})

const Role = bookshelf.model('Role', {
    tableName:'vendors_roles',
    user() {
        return this.hasMany('User')
    }
})

module.exports = {User, Role}