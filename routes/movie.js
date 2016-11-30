const Movie = require('./../models/Movie.js');

module.exports = {
  movieAdd: function(req, res) {
    if(req.params.name){//update
      return res.render('movie', {
        title: req.params.name + '|电影|管理|moive.me',
        label: '编辑电影:' + req.params.name,
        movie: req.params.name
      });
    } else {
      return res.render('movie', {
        title: '新增加|电影|管理|moive.me',
        label: '新增加电影',
        movie: false
      });
    }
  },
  doMovieAdd: function(req, res) {
    res.send({'success':true});
  }
}

// exports.movieAdd = function(req, res) {
//   if(req.params.name){//update
//     return res.render('movie', {
//       title: req.params.name + '|电影|管理|moive.me',
//       label: '编辑电影:' + req.params.name,
//       movie: req.params.name
//     });
//   } else {
//     return res.render('movie', {
//       title: '新增加|电影|管理|moive.me',
//       label: '新增加电影',
//       movie: false
//     });
//   }
// };
//
// exports.doMovieAdd = function(req, res) {
//   res.send({'success':true});
// };
