const mssql = require('mssql');
const config = require('../Configs/mssqlConfigs');

let connection = null;

exports.getConnection = async(callback) => {
    try {
        connection = await mssql.connect(config);
        return callback(null, connection);
    } catch (error) {
        return callback(error, null);
    }
}

exports.closeConnection = () => {
    try {
        // try to close the connection pool
        if (connection) {
            connection.close();
        }

        // set the pool to null to ensure
        // a new one will be created by getConnection()
        connection = null;
    } catch (err) {
        // error closing the connection (could already be closed)
        // set the pool to null to ensure
        // a new one will be created by getConnection()
        connection = null;
        console.log(err);
    }
}