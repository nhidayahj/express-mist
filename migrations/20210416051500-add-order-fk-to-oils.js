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
  return db.addColumn('orders_oils', 'order_id', {
      type:'int',
      notNull:true, 
      foreignKey:{
          name:"add_order_oils_fk",
          table:"ship_orders",
          rules:{
              onDelete:'CASCADE',
              onUpdate:'RESTRICT'
          }, 
          mapping:{
              'order_id':'id'
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
