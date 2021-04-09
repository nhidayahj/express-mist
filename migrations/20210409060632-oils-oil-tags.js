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
  return db.createTable('oils_oil_tags', {
      id:{type:'int', primaryKey:true, autoIncrement:true},
      oil_id:{
          type:'int',
          notNull:true, 
          foreignKey:{
              name:'oils_to_tag_fk',
              table:'oils',
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              },
              mapping:{
                  oil_id:'id'
              }
          }
      },
      oil_tag_id:{
          type:'int',
          unsigned:true, 
          notNull:true, 
          foreignKey:{
              name:'tags_to_oil_fk',
              table:'oil_tags',
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              }, 
              mapping:{
                  oil_tag_id:'id'
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
