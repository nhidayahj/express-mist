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
  return db.createTable('ship_orders', {
      id:{type:'int', primaryKey:true, autoIncrement:true},
      street_name:{type:'string', length:200},
      postal_code:{type:'string',length:20},
      unit_code:{type:'string', length:20},
      amount:'int',
      payment_status:{type:'string', length:20},
      payment_type:{type:'string', length:10}
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
