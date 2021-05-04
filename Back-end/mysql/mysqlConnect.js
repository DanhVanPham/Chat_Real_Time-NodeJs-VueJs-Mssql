var mysql = require('mysql');
var connection = mysql.createPool({
    host: 'bxb0w15dsfeimpm2aykl-mysql.services.clever-cloud.com',
    user: 'uxczyoie3pycavd1',
    password: 'ZIXssdN47xW2F9HOOzic',
    database: 'bxb0w15dsfeimpm2aykl'
});

module.exports = connection;