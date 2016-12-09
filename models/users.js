var User = require('../lib/mongo').User;
var Logs = require('../lib/mongo').Logs;
module.exports = {
  // 注册一个用户
  create: function create(user) {
    return User.create(user).exec();
  },

  // 日志
  createLog: function create(logs) {
    return Logs.create(logs).exec();
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName(name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec();
  }
};
