const connection = require('../mysqlConnect.js');


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
    try {
        // connection.connect();
        connection.query("Insert into RoomDetails(roomName, roomAvatar, roomId, userId, status) VALUES ?", [
                [
                    [body.roomNameTo,
                        body.roomAvatarTo, room.roomId, body.userFromId, defaultStatus
                    ],
                    [body.roomNameFrom, body.roomAvatarFrom, room.roomId, body.userToId, defaultStatus]
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

RoomDetails.create_new_room_details_multi_users = (listCart, body, room, callback) => {
    if (!body.roomAvatar) {
        body.roomAvatar = '';
    }
    if (body.roomName) {
        var defaultStatus = 1;
        var checkStatus = false;
        var array = [];
        try {
            for (let i = 0; i < listCart.length; i++) {
                array.push([body.roomName, body.roomAvatar, room.roomId, listCart[i].userId, defaultStatus]);
            }
            // connection.connect();
            connection.query("INSERT INTO RoomDetails(roomName, roomAvatar, roomId, userId, status) VALUES ? ", [array],
                function(error, results) {
                    if (error) { callback("Create new room details with multi users failed!", null); } else { callback(null, "Create new room details with multi users successfully!") }
                });
            // connection.end();
        } catch (error) {
            callback("Create new room details with multi users failed!", null);
        }
    } else {
        callback("Require input room name!", null);
    }

}

RoomDetails.getRoomDetailsByUserId = (userId, callback) => {
    var defaultStatus = 1;
    try {
        // connection.connect();
        connection.query("SELECT roomDetails.*, room.sender, room.content, room.fullName FROM (SELECT roomDetailId, roomName, roomAvatar, roomId FROM RoomDetails WHERE userId = ?) roomDetails " +
            " LEFT JOIN ( " +
            " SELECT roomDetails.roomDetailId, roomDetails.roomName, roomDetails.roomAvatar, roomDetails.roomId, messages.content, messages.sender, users.fullName     FROM RoomDetails roomDetails JOIN (SELECT roomDetails.roomId, max(createdAt) as 'createdAtMess' FROM RoomDetails roomDetails JOIN " +
            " (SELECT roomDetailID, max(createdAt) as 'createdAt' FROM Messages WHERE " +
            " roomDetailId in (SELECT roomDetailId FROM RoomDetails WHERE roomId in " +
            " (SELECT roomId FROM RoomDetails WHERE userId = ? and status = ?)) GROUP BY roomDetailId) cs ON roomDetails.roomDetailId = cs.roomDetailId " +
            " GROUP BY roomDetails.roomId) " +
            " custom ON roomDetails.roomId = custom.roomId  " +
            " JOIN Users users ON roomDetails.userId = users.userId" +
            " JOIN Messages messages ON messages.roomDetailId = roomDetails.roomDetailId and custom.createdAtMess = messages.createdAt WHERE " +
            " roomDetails.status = ? and messages.status = ?) room " +
            " ON roomDetails.roomId = room.roomId", [userId, userId, defaultStatus, defaultStatus, defaultStatus],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }
}

RoomDetails.getRoomDetailsByRoomDetailId = (roomDetailId, callback) => {
    var defaultStatus = 1;
    try {
        // connection.connect();
        connection.query("SELECT * FROM RoomDetails WHERE roomId in (select roomId from RoomDetails where roomDetailId = ? and status = ?) and status = @status ", [roomDetailId, defaultStatus],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }

}

RoomDetails.getRoomDetailByUserIdAndRoomId = (sender, roomId, callback) => {
    var defaultStatus = 1;
    try {
        // connection.connect();
        connection.query("SELECT * FROM RoomDetails WHERE userId = ? and roomId = ? and status = ?", [sender, roomId, defaultStatus],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }

}

RoomDetails.getRoomDetailsBetweenUsers = (userFromId, userToId, callback) => {
    var defaultStatus = 1;
    var defaultCount = 2;
    try {
        // connection.connect();
        connection.query("SELECT * FROM RoomDetails WHERE roomId IN (SELECT custom.roomId FROM RoomDetails roomDetail RIGHT JOIN  " +
            "( SELECT groupUserFrom.roomId FROM (SELECT roomId FROM RoomDetails WHERE userId = ?) " +
            "groupUserFrom  JOIN (SELECT roomId FROM RoomDetails WHERE userId = ?) groupUserTo " +
            " ON groupUserFrom.roomId = groupUserTo.roomId) custom ON roomDetail.roomId = custom.roomId " +
            " GROUP BY custom.roomId HAVING COUNT(*) = ?) and " +
            " userId = ? and status = ? ", [userFromId, userToId, defaultCount, userFromId, defaultStatus],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }

}

RoomDetails.checkExistGroupBetweenTwoUsers = (userFromId, userToId, callback) => {
    let defaultStatus = 1;
    let defaultCount = 2;
    try {
        // connection.connect();
        connection.query("SELECT COUNT(*) as 'Count' FROM RoomDetails roomDetail RIGHT JOIN " +
            " ( SELECT groupUserFrom.roomId FROM (SELECT roomId FROM RoomDetails " +
            "WHERE userId = ? and status = ?) groupUserFrom  JOIN " +
            "(SELECT roomId FROM RoomDetails WHERE userId = ? and status = ?) groupUserTo " +
            " ON groupUserFrom.roomId = groupUserTo.roomId) custom ON roomDetail.roomId = custom.roomId " +
            "GROUP BY custom.roomId HAVING COUNT(*)= ?", [userFromId, defaultStatus, userToId, defaultStatus, defaultCount],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }

}

module.exports = RoomDetails;