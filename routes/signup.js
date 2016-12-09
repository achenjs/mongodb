const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const Logs = require('../lib/mongo').Logs;
const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
  var name = req.fields.name;
  // const gender = req.fields.gender;
  // const bio = req.fields.bio;
  // const avatar = req.files.avatar.path.split(path.sep).pop();
  var password = req.fields.password;
  var repassword = req.fields.repassword;
  var role = [];

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符');
    }
    // if (['m', 'f', 'x'].indexOf(gender) === -1) {
    //   throw new Error('性别只能是 m、f 或 x');
    // }
    // if (!(bio.length >= 1 && bio.length <= 30)) {
    //   throw new Error('个人简介请限制在 1-30 个字符');
    // }
    // if (!req.files.avatar.name) {
    //   throw new Error('缺少头像');
    // }
    if (password.length < 5) {
      throw new Error('密码至少 5 个字符');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  // 明文密码加密
  password = sha1(password);
  // 待写入数据库的用户信息
  var user = {
    name: name,
    password: password
    // gender: gender,
    // bio: bio,
    // avatar: avatar
  };
  // 用户信息写入mongodb数据库
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0];
      // 将用户信息存入 session
      delete user.password;
      req.session.user = user;
      // 写入 flash
      req.flash('success', '注册成功');
      // 跳转到首页
      res.redirect('/posts');
    })
    .catch(function (e) {
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/signup');
      }
      next(e);
    });
  //用户信息写入mysql
    for(var i in req.fields.role) {
        req.models.role.get(req.fields.role[i], function (err, result) {
            role.push(result);
        });
    }
  req.models.userinfo.create(
      [{
        name: name,
        password: password,
        isdelete: false
      }], function (err, item) {
        req.models.userinfo.get(item[0].id, function (err, item01) {
            item01.role = role;
            item01.save();
        })
      }
  )
});

module.exports = router;
