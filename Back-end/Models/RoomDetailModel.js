const sql = require('mssql');
const connection = require('./db.js');
const moment = require('moment');


var RoomDetails = function(roomDetail) {
    this.roomDetailId = roomDetail.roomDetailId;
    this.roomId = roomDetail.roomId;
    this.roomName = room.roomName;
    this.roomAvatar = room.roomAvatar;
    this.userId = roomDetail.userId;
    this.status = roomDetail.status;
}

RoomDetails.create_new_room_details_two_users = (body, room, callback) => {
    if (!body.roomNameFrom) {
        body.roomNameFrom = '';
    }
    if (!body.roomNameTo) {
        body.roomNameTo = '';
    }
    if (!body.roomAvatarFrom) {
        body.roomAvatarFrom = '';
    }
    if (!body.roomAvatarTo) {
        body.roomAvatarTo = '';
    }
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("Insert into RoomDetails(roomName, roomAvatar, roomId, userId, status) values(N'" +
            body.roomNameTo + "', '" + body.roomAvatarTo + "', '" +
            room.roomId + "', '" + body.userFromId + "', " + defaultStatus + "), (N'" +
            body.roomNameFrom + "', '" + body.roomAvatarFrom + "', '" +
            room.roomId + "', '" + body.userToId + "', " + defaultStatus + ")");
    }).then(result => {
        callback(null, result);
    }).catch(error => {
        callback(error, null);
    })
}

RoomDetails.create_new_room_details_multi_users = (listCart, body, room, callback) => {
    if (!body.roomAvatar) {
        body.roomAvatar = '';
    }
    if (body.roomName) {
        var defaultStatus = 1;
        connection.then(() => {
            for (let i = 0; i < listCart.length; i++) {
                sql.query("Insert into RoomDetails(roomName, roomAvatar, roomId, userId, status) values(N'" +
                    body.roomName + "', '" + body.roomAvatar + "', '" +
                    room.roomId + "', '" + listCart[i].userId + "', " + defaultStatus + ")");
            }
        }).then(result => {
            callback(null, "Create new room multi users successfull.");
        }).catch(error => {
            callback(error, null);
        })
    } else {
        callback("Require input room name!", null);
    }

}

RoomDetails.getRoomDetailsByUserId = (userId, callback) => {
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("SELECT roomDetails.*, room.sender, room.content, room.fullName FROM (SELECT roomDetailId, roomName, roomAvatar, roomId FROM RoomDetails WHERE userId = '" + userId + "') roomDetails " +
            " LEFT JOIN ( " +
            " SELECT roomDetails.roomDetailId, roomDetails.roomName, roomDetails.roomAvatar, roomDetails.roomId, messages.content, messages.sender, users.fullName     FROM RoomDetails roomDetails JOIN (SELECT roomDetails.roomId, max(createdAt) as 'createdAtMess' FROM RoomDetails roomDetails JOIN " +
            " (SELECT roomDetailID, max(createdAt) as 'createdAt' FROM Messages WHERE " +
            " roomDetailId in (SELECT roomDetailId FROM RoomDetails WHERE roomId in " +
            " (SELECT roomId FROM RoomDetails WHERE userId = '" + userId + "' and status = " + defaultStatus + ")) GROUP BY roomDetailId) cs ON roomDetails.roomDetailId = cs.roomDetailId " +
            " GROUP BY roomDetails.roomId) " +
            " custom ON roomDetails.roomId = custom.roomId  " +
            " JOIN Users users ON roomDetails.userId = users.userId" +
            " JOIN Messages messages ON messages.roomDetailId = roomDetails.roomDetailId and custom.createdAtMess = messages.createdAt WHERE " +
            " roomDetails.status = " + defaultStatus + " and messages.status = " + defaultStatus + ") room " +
            " ON roomDetails.roomId = room.roomId");
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    });
}

RoomDetails.getRoomDetailsByRoomDetailId = (roomDetailId, callback) => {
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("SELECT * FROM RoomDetails WHERE roomId in (select roomId from RoomDetails where roomDetailId = '" + roomDetailId + "' and status = " + defaultStatus + ") and status = " + defaultStatus);
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    })
}

RoomDetails.getRoomDetailByUserIdAndRoomId = (sender, roomId, callback) => {
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("SELECT * FROM RoomDetails WHERE userId = '" + sender + "' and roomId = " + roomId + " and status = " + defaultStatus);
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    });
}

RoomDetails.getRoomDetailsBetweenUsers = (userFromId, userToId, callback) => {
    var defaultStatus = 1;
    var defaultCount = 2;
    connection.then(() => {
        return sql.query("SELECT * FROM RoomDetails WHERE roomId IN (SELECT custom.roomId FROM RoomDetails roomDetail RIGHT JOIN  ( SELECT groupUserFrom.roomId FROM (SELECT roomId FROM RoomDetails WHERE userId = '" + userFromId + "') groupUserFrom  JOIN (SELECT roomId FROM RoomDetails WHERE userId = '" + userToId + "') groupUserTo " +
            " ON groupUserFrom.roomId = groupUserTo.roomId) custom ON roomDetail.roomId = custom.roomId GROUP BY custom.roomId HAVING COUNT(*) = " + defaultCount + ") and userId = '" + userFromId + "' and status = " + defaultStatus);
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    })
}

RoomDetails.checkExistGroupBetweenTwoUsers = (userFromId, userToId, callback) => {
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("SELECT COUNT(*) as 'Count' FROM RoomDetails roomDetail RIGHT JOIN  ( SELECT groupUserFrom.roomId FROM (SELECT roomId FROM RoomDetails WHERE userId = '" + userFromId + "' and status = " + defaultStatus + ") groupUserFrom  JOIN (SELECT roomId FROM RoomDetails WHERE userId = '" + userToId + "' and status = " + defaultStatus + ") groupUserTo " +
            " ON groupUserFrom.roomId = groupUserTo.roomId) custom ON roomDetail.roomId = custom.roomId GROUP BY custom.roomId HAVING COUNT(*)= 2");
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    })
}

module.exports = RoomDetails;