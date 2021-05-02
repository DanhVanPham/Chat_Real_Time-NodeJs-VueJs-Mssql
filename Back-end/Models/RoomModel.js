const sql = require('mssql');
const connection = require('./db.js');
const moment = require('moment');

var Rooms = function(room) {
    this.roomId = room.roomId;
    let d = new Date();
    this.createdAt = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    this.status = room.status;
}

Rooms.createNewRoom = async(room, callback) => {
    var defaultStatus = 1;
    room.status = defaultStatus;
    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("createdAt", sql.DateTime, room.createdAt)
                .input("status", sql.Int, defaultStatus)
                .query("Insert into Rooms(createdAt, status) values(@createdAt, @status)").then((result) => {
                    callback(null, room);
                }).catch((err) => {
                    callback(err, null);
                });
        }
    }).finally(() => {
        connection.closeConnection();
    })
}

Rooms.getRoomByTimeCreatedAndStatus = async(room, callback) => {
    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("createdAt", sql.DateTime, room.createdAt)
                .input("status", sql.Int, room.status)
                .query("SELECT * FROM Rooms WHERE createdAt = @createdAt and status = @status").then((result) => {
                    callback(null, result.recordset[0]);
                }).catch((err) => {
                    callback(err, null);
                });
        }
    }).finally(() => {
        connection.closeConnection();
    })
}


module.exports = Rooms;