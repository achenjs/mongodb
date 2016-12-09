/**
 * Created by achen on 2016/12/8.
 */
const orm = require('orm');

const mysqlConfig = require('./mysql-config');

module.exports = function (app) {
  app.use(orm.express(mysqlConfig.config, {
      define: function (db, models, next) {
          models.userinfo = db.define('userinfo', {
              name: String,
              password: String,
              isdelete: Boolean
          }, {
              autoFetch: true,
              cache: false
          });

          models.role = db.define('role', {
              name: String,
              isdelete: Boolean
          }, {
              cache: false
          });
          
          models.userinfo.hasMany('role', models.role);
          models.userinfo.sync();
          models.role.sync();
          next();
      }
  }))
};