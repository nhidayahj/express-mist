'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('diffuser_cart_items', {
      id:{type:'int', primaryKey:true, autoIncrement:true},
      quantity:{type:'int', unsigned:true},
      customer_id:{
          type:'int',
          unsigned:true, 
          notNull:true, 
          foreignKey:{
              name:'diffuser_cart_user_fk',
              table:'users_customers', 
              mapping:{
                  customer_id:'id'
              }, 
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              }
          }
      }, 
      diffuser_id:{
          type:'int',
          notNull:true, 
          foreignKey:{
              name:'diffuser_cart_fk',
              table:'diffusers',
              mapping:{
                  diffuser_id:'id'
              }, 
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              }
          }
      }
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
