module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts');
  });

  app.use('/signup', require('./signup'));   // 注册逻辑

  app.use('/signin', require('./signin'));    // 登录逻辑

  app.use('/signout', require('./signout'));  // 退出逻辑

  app.use('/posts', require('./posts'));  // 主页逻辑


  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('404');
    }
  });

};
