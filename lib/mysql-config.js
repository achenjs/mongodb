/**
 * Created by achen on 2016/12/8.
 */
const mysqlConfig ={
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'myachen',
    port:'3306'
};

module.exports = {
    config:'mysql://'+mysqlConfig.user+':'+mysqlConfig.password+'@'+mysqlConfig.host+':'+mysqlConfig.port+'/'+mysqlConfig.database
};