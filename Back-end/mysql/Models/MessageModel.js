const connection = require('../mysqlConnect.js');
const moment = require('moment');

var Messages = function(message) {
    this.messageId = message.messageId;
    this.roomDetailId = message.roomDetailId;
    this.content = message.content;
    this.sender = message.sender;
    let d = new Date();
    this.createdAt = [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
        d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()
    ].join('-') + ' ' + [d.getHours() < 10 ? '0' + (d.getHours()) : d.getHours(),
        d.getMinutes() < 10 ? '0' + (d.getMinutes()) : d.getMinutes(), d.getSeconds() < 10 ? '0' + (d.getSeconds()) : d.getSeconds()
    ].join(':');
    this.status = message.status;
}

Messages.create_new_message = (message, roomDetail, callback) => {
    var defaultStatus = 1;
    message.messageId = moment().valueOf().toString();
    message.status = defaultStatus;
    message.roomDetailId = roomDetail.roomDetailId;
    try {
        // connection.connect();
        connection.query("INSERT INTO Messages(messageId, roomDetailId, content, sender, createdAt, status) " +
            "VALUES ?", [
                [
                    [message.messageId, message.roomDetailId, message.content, message.sender, new Date(message.createdAt), message.status]
                ]
            ],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }
}

Messages.get_list_messages_by_room_detail = (roomDetailId, callback) => {
    try {
        // connection.connect();
        connection.query("SELECT messageId, roomDetailId, content, sender, mes.createdAt, mes.status, users.fullName, users.avatar " +
            "FROM Messages mes JOIN Users users on mes.sender = users.userId " +
            " WHERE messageId in (SELECT messageId FROM Messages WHERE roomDetailId in (SELECT roomDetailId FROM RoomDetails " +
            "WHERE roomId in(SELECT roomId FROM RoomDetails WHERE roomDetailId = ?))) ORDER BY messageId", [
                [roomDetailId]
            ],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }
}

module.exports = Messages;