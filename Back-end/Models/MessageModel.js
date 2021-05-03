const config = require('../Configs/mssqlConfigs');
const sql = require('mssql');
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
    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("messageId", sql.VarChar, message.messageId)
                .input("roomDetailId", sql.Int, message.roomDetailId)
                .input("content", sql.NVarChar, message.content)
                .input("sender", sql.VarChar, message.sender)
                .input("createdAt", sql.DateTime, message.createdAt)
                .input("status", sql.Int, message.status)
                .query("INSERT INTO Messages(messageId, roomDetailId, content, sender, createdAt, status) VALUES( @messageId , @roomDetailId , @content , @sender , @createdAt , @status )")
                .then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        callback(error, null);
    }
}

Messages.get_list_messages_by_room_detail = (roomDetailId, callback) => {
    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("roomDetailId", sql.Int, roomDetailId)
                .query("SELECT messageId, roomDetailId, content, sender, mes.createdAt, mes.status, users.fullName, users.avatar " +
                    "FROM Messages mes JOIN Users users on mes.sender = users.userId " +
                    " WHERE messageId in (SELECT messageId FROM Messages WHERE roomDetailId in (SELECT roomDetailId FROM RoomDetails " +
                    "WHERE roomId in(SELECT roomId FROM RoomDetails WHERE roomDetailId = @roomDetailId))) ORDER BY messageId").then(result => {
                    callback(null, result.recordset);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        callback(error, null);
    }
}

module.exports = Messages;