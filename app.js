// const express = require('express');
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const path = require('path');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const ejs = require('ejs-locals');
// const routes = require('./routes/index');
// const users = require('./routes/users');
// const flash = require('connect-flash');
// const pkg = require('./package');
// const app = express();
// const config = require('config-lite');
//
//
// require('./routes/log')();
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.engine('.html', ejs);
// app.set('view engine', 'html');
//
// // session 中间件
// app.use(session({
//   name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
//   secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
//   cookie: {
//     maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
//   },
//   store: new MongoStore({// 将 session 存储到 mongodb
//     url: config.mongodb// mongodb 地址
//   })
// }));
//
// // flash 中间价，用来显示通知
// app.use(flash());
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// // 定义日志和输出级别
// app.use(logger('dev'));
// // 定义数据解析器
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// // 定义cookie解析器
// app.use(cookieParser());
// // 定义静态文件目录
// app.use(express.static(path.join(__dirname, 'public')));
//
// // 设置模板全局常量
// app.locals.blog = {
//   title: pkg.name,
//   description: pkg.description
// };
//
// // 添加模板必需的三个变量
// app.use(function (req, res, next) {
//   res.locals.user = req.session.user;
//   res.locals.success = req.flash('success').toString();
//   res.locals.error = req.flash('error').toString();
//   next();
// });
//
// // 处理表单及文件上传的中间件
// app.use(require('express-formidable')({
//   uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
//   keepExtensions: true// 保留后缀
// }));
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });
//
// // 路由
// routes(app);
//
//
// module.exports = app;

var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}));
// flash 中间价，用来显示通知
app.use(flash());
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
// 路由
routes(app);
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

// error page
app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  });
});

if (module.parent) {
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}
