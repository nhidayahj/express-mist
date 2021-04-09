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
  return db.createTable('oils_sizes', {
      id:{type:'int', primaryKey:true, autoIncrement:true},
      'oil_id':{
          type:'int',
          notNull:true,
          foreignKey:{
              name:'oils_sizes_oil_fk',
              table:'oils',
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              }, 
              mapping:'id'
          }
      }, 
      'size_id':{
          type:'int',
          notNull:true,
          foreignKey:{
              name:'oils_sizes_size_fk',
              table:'sizes',
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              },
              mapping:'id'
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
