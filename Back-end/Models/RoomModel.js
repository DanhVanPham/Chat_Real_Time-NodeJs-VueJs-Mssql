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

Rooms.createNewRoom = (room, callback) => {
    var defaultStatus = 1;
    room.status = defaultStatus;
    connection.then(() => {
        return sql.query("Insert into Rooms(createdAt, status) values('" +
            room.createdAt + "', " + defaultStatus + ")");
    }).then((result) => {
        callback(null, room);
    }).catch((err) => {
        callback(err, null);
    });
}

Rooms.getRoomByTimeCreatedAndStatus = (room, callback) => {
    connection.then(() => {
        return sql.query("SELECT * FROM Rooms WHERE createdAt = '" + room.createdAt + "' and status = " + room.status);
    }).then((result) => {
        callback(null, result.recordset[0]);
    }).catch((err) => {
        callback(err, null);
    });
}


module.exports = Rooms;