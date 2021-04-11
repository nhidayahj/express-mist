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
  return db.addColumn('users_vendors', 'role_id', {
      type:'int',
      unsigned:true,
      notNull:true, 
      foreignKey:{
          'name':'users_vendors_role_fk',
          'table':'vendors_roles',
          'mapping':{
              'role_id':'id'
          }, 
          'rules':{
              onDelete:'CASCADE', 
              onUpdate:'RESTRICT'
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
