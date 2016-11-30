const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs-locals');
const routes = require('./routes/index');
const users = require('./routes/users');
const movie = require('./routes/movie');
const session = require('express-session');
const SessionStore = require('connect-mongo')(session);

// const store = new SessionStore({
//     url: "mongodb://localhost/session",
//     interval: 120000 // expiration check worker run interval in millisec (default: 60000)
// });

const app = express();

require('./routes/log')();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs);
app.set('view engine', 'html');

app.get('/movie/add', movie.movieAdd);//增加
app.post('/movie/add', movie.doMovieAdd);//提交
app.get('/movie/:name', movie.movieAdd);//编辑查询
app.get('/movie/json/:name', movie.movieJSON);//JSON数据

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
  secret: 'achen',
  store: new SessionStore({
    url : "mongodb://localhost/a"
  }),
  cookie: { maxAge: 1000 * 60 * 60}
}));
// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 定义cookie解析器
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// 匹配路径和路由
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
