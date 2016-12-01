module.exports = {
  port: 88,
  session: {
    secret: 'my',
    key: 'my',
    maxAge: 1000*60*60
  },
  mongodb: 'mongodb://localhost:27017/my'
};
