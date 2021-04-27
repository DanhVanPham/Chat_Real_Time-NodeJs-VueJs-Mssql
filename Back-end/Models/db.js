const mssql = require('mssql');
const config = require('../Configs/mssqlConfigs');

var connection = mssql.connect(config);

module.exports = connection;