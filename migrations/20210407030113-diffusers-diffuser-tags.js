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
  return db.createTable('diffusers_diffuser_tags', {
      id:{type:'int', primaryKey:true, autoIncrement:true}, 
      diffuser_id: {
          type:'int',
          notNull:true,
          foreignKey:{
              name:'diffuser_to_tag_fk', 
              table:'diffusers',
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              }, 
              mapping:{
                  diffuser_id:'id'
              }
          }
      }, 
      diffuser_tag_id:{
          type:'int', 
          unsigned:true, 
          notNull:true, 
          foreignKey:{
              name:'tag_to_diffuser_fk',
              table:'diffuser_tags',
              rules:{
                  onDelete:'CASCADE',
                  onUpdate:'RESTRICT'
              }, 
              mapping:{
                  diffuser_tag_id:'id'
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
