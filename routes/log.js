const log4js = require('log4js');

module.exports = function(){
  log4js.configure({
    appenders: [
      {
        type: 'console'
      },
      {
        type: 'dateFile',
        filename: 'logs/access',
        pattern: '-yyyy-MM-dd.log',
        // maxLogSize: 1000,
        backups: 4,
        alwaysIncludePattern: true
        // absolute: true
        // category: 'normal'
      }
    ],
    replaceConsole: true
  });
  var logger = log4js.getLogger();
  logger.setLevel('INFO');
}
