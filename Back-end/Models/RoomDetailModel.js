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
        return sql.query("SELECT * FROM RoomDetails WHERE userId = '" + userId + "' and status = " + defaultStatus);
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
        return sql.query("SELECT * FROM RoomDetails WHERE userId = '" + sender + "' and roomId = '" + roomId + "' and status = " + defaultStatus);
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    });
}

RoomDetails.checkExistRoomDetailsBetweenUsers = (userFromId, userToId, callback) => {
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("SELECT * FROM RoomDetails WHERE roomId in (SELECT roomId FROM RoomDetails WHERE userId = '" + userToId + "') and userId = '" + userFromId + "' and status =" + defaultStatus)
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    })
}

RoomDetails.checkTotalMemberRoomDetails = (userFromId, userToId, callback) => {
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("SELECT COUNT(*) as 'COUNT' FROM RoomDetails WHERE roomId in (SELECT roomId FROM RoomDetails WHERE roomId in (SELECT roomId FROM RoomDetails WHERE userId = '" + userToId + "')  and userId = '" + userFromId + "' and status = " + defaultStatus + ")");
    }).then(result => {
        callback(null, result.recordsets[0]);
    }).catch(error => {
        callback(error, null);
    })
}

module.exports = RoomDetails;