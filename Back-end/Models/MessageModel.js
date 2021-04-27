const mssql = require('mssql');
const connection = require('./db.js');
const moment = require('moment');

var Messages = function(message) {
    this.messageId = message.messageId;
    this.roomDetailId = message.roomDetailId;
    this.content = message.content;
    this.sender = message.sender;
    let d = new Date();
    this.createdAt = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    this.status = message.status;
}

Messages.create_new_message = (message, roomDetail, callback) => {
    var defaultStatus = 1;
    message.messageId = moment().valueOf().toString();
    message.status = defaultStatus;
    message.roomDetailId = roomDetail.roomDetailId;
    connection.then(() => {
        return mssql.query("INSERT INTO Messages(messageId, roomDetailId, content, sender, createdAt, status) VALUES('" + message.messageId + "', " + message.roomDetailId + ", '" +
            message.content + "', '" + message.sender + "', '" + message.createdAt + "', " + message.status + ")");
    }).then(result => {
        callback(null, result);
    }).catch(error => {
        callback(error, null);
    })
}

Messages.get_list_messages_by_room_detail = (roomDetailId, callback) => {
    connection.then(() => {
        return mssql.query("SELECT * FROM Messages WHERE messageId in (SELECT messageId FROM Messages WHERE roomDetailId in (SELECT roomDetailId FROM RoomDetails WHERE roomId in(SELECT roomId FROM RoomDetails WHERE roomDetailId = " + roomDetailId + "))) ORDER BY messageId")
    }).then(result => {
        callback(null, result.recordset);
    }).catch(error => {
        callback(error, null);
    })
}

module.exports = Messages;