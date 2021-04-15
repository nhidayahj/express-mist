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
  return db.addColumn('ship_orders', 'customer_id', {
      type:'int',
      unsigned:true,
      notNull:true, 
      foreignKey:{
          name:'add_customers_to_orders_fk',
          table:'users_customers',
          rules:{
              onDelete:'CASCADE',
              onUpdate:'RESTRICT'
          },
          mapping:{
              'customer_id':'id'
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
