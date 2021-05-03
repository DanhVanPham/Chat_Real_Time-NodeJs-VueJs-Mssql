const config = require('../Configs/mssqlConfigs');
const sql = require('mssql');

var Rooms = function(room) {
    this.roomId = room.roomId;
    let d = new Date();
    this.createdAt = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    this.status = room.status;
}

Rooms.createNewRoom = (room, callback) => {
    var defaultStatus = 1;
    room.status = defaultStatus;
    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("createdAt", sql.DateTime, room.createdAt)
                .input("status", sql.Int, defaultStatus)
                .query("Insert into Rooms(createdAt, status) values(@createdAt, @status)").then((result) => {
                    callback(null, room);
                }).catch((err) => {
                    callback(err, null);
                })
        })
    } catch (error) {
        callback(error, null);
    }
}

Rooms.getRoomByTimeCreatedAndStatus = (room, callback) => {
    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("createdAt", sql.DateTime, room.createdAt)
                .input("status", sql.Int, room.status)
                .query("SELECT * FROM Rooms WHERE createdAt = @createdAt and status = @status").then((result) => {
                    callback(null, result.recordset[0]);
                }).catch((err) => {
                    callback(err, null);
                })
        })
    } catch (error) {
        callback(error, null);
    }
}


module.exports = Rooms;