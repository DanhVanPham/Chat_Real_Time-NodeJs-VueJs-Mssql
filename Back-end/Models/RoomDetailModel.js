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

RoomDetails.create_new_room_details_two_users = async(body, room, callback) => {
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
    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("roomNameTo", sql.NVarChar, body.roomNameTo)
                .input("roomAvatarTo", sql.NVarChar, body.roomAvatarTo)
                .input("roomId", sql.Int, room.roomId)
                .input("userFromId", sql.VarChar, body.userFromId)
                .input("status", sql.Int, defaultStatus)
                .input("roomNameFrom", sql.NVarChar, body.roomNameFrom)
                .input("roomAvatarFrom", sql.NVarChar, body.roomAvatarFrom)
                .input("userToId", sql.VarChar, body.userToId)
                .query("Insert into RoomDetails(roomName, roomAvatar, roomId, userId, status) values(@roomNameTo, " +
                    " @roomAvatarTo , @roomId, @userFromId, @status), (@roomNameFrom, @roomAvatarFrom, @roomId, @userToId, @status)").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

RoomDetails.create_new_room_details_multi_users = async(listCart, body, room, callback) => {
    if (!body.roomAvatar) {
        body.roomAvatar = '';
    }
    if (body.roomName) {
        var defaultStatus = 1;
        var checkStatus = false;
        await connection.getConnection(async(error, result) => {
            if (error) {
                callback("Connection to mssql server failed!", null);
            }
            if (result) {

                /* Using Transaction in query */

                const transaction = new sql.Transaction(result);
                transaction.begin(async(err) => {
                    if (err) {
                        callback(err, null);
                    }
                    for (let i = 0; i < listCart.length; i++) {
                        await result.request()
                            .input("roomName", sql.NVarChar, body.roomName)
                            .input("roomAvatar", sql.NVarChar, body.roomAvatar)
                            .input("roomId", sql.Int, room.roomId)
                            .input("userId", sql.VarChar, listCart[i].userId)
                            .input("status", sql.Int, defaultStatus)
                            .query("Insert into RoomDetails(roomName, roomAvatar, roomId, userId, status) values(@roomName, " +
                                " @roomAvatar, @roomId , @userId , @status)").then(result => {
                                checkStatus = true;
                            }).catch(async(error) => {
                                await transaction.rollback(() => {
                                    callback(error, null);
                                });
                                checkStatus = false;
                            })
                    }
                    await transaction.commit(() => {
                        callback(null, "Create new room details with multi users successfully!");
                    })
                })
            }
        }).finally(() => {
            if (checkStatus) {
                callback(null, "Create new room details with multi users successfully!");
            } else {
                callback("Create new room details with multi users failed!", null);
            }
            connection.closeConnection();
        })
    } else {
        callback("Require input room name!", null);
    }

}

RoomDetails.getRoomDetailsByUserId = async(userId, callback) => {
    var defaultStatus = 1;

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("userId", sql.VarChar, userId)
                .input("status", sql.Int, defaultStatus)
                .query("SELECT roomDetails.*, room.sender, room.content, room.fullName FROM (SELECT roomDetailId, roomName, roomAvatar, roomId FROM RoomDetails WHERE userId = @userId) roomDetails " +
                    " LEFT JOIN ( " +
                    " SELECT roomDetails.roomDetailId, roomDetails.roomName, roomDetails.roomAvatar, roomDetails.roomId, messages.content, messages.sender, users.fullName     FROM RoomDetails roomDetails JOIN (SELECT roomDetails.roomId, max(createdAt) as 'createdAtMess' FROM RoomDetails roomDetails JOIN " +
                    " (SELECT roomDetailID, max(createdAt) as 'createdAt' FROM Messages WHERE " +
                    " roomDetailId in (SELECT roomDetailId FROM RoomDetails WHERE roomId in " +
                    " (SELECT roomId FROM RoomDetails WHERE userId = @userId and status = @status)) GROUP BY roomDetailId) cs ON roomDetails.roomDetailId = cs.roomDetailId " +
                    " GROUP BY roomDetails.roomId) " +
                    " custom ON roomDetails.roomId = custom.roomId  " +
                    " JOIN Users users ON roomDetails.userId = users.userId" +
                    " JOIN Messages messages ON messages.roomDetailId = roomDetails.roomDetailId and custom.createdAtMess = messages.createdAt WHERE " +
                    " roomDetails.status = @status and messages.status = @status) room " +
                    " ON roomDetails.roomId = room.roomId").then(result => {
                    callback(null, result.recordsets[0]);
                }).catch(error => {
                    callback(error, null);
                });
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

RoomDetails.getRoomDetailsByRoomDetailId = async(roomDetailId, callback) => {
    var defaultStatus = 1;

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("roomDetailId", sql.Int, roomDetailId)
                .input("status", sql.Int, defaultStatus)
                .query("SELECT * FROM RoomDetails WHERE roomId in (select roomId from RoomDetails where roomDetailId = @roomDetailId and status = @status) and status = @status ").then(result => {
                    callback(null, result.recordsets[0]);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

RoomDetails.getRoomDetailByUserIdAndRoomId = async(sender, roomId, callback) => {
    var defaultStatus = 1;

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("userId", sql.VarChar, sender)
                .input("roomId", sql.Int, roomId)
                .input("status", sql.Int, defaultStatus)
                .query("SELECT * FROM RoomDetails WHERE userId = @userId and roomId = @roomId and status = @status").then(result => {
                    callback(null, result.recordsets[0]);
                }).catch(error => {
                    callback(error, null);
                });
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

RoomDetails.getRoomDetailsBetweenUsers = async(userFromId, userToId, callback) => {
    var defaultStatus = 1;
    var defaultCount = 2;

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("userFromId", sql.VarChar, userFromId)
                .input("userToId", sql.VarChar, userToId)
                .input("status", sql.Int, defaultStatus)
                .input("count", sql.Int, defaultCount)
                .query("SELECT * FROM RoomDetails WHERE roomId IN (SELECT custom.roomId FROM RoomDetails roomDetail RIGHT JOIN  " +
                    "( SELECT groupUserFrom.roomId FROM (SELECT roomId FROM RoomDetails WHERE userId = @userFromId) " +
                    "groupUserFrom  JOIN (SELECT roomId FROM RoomDetails WHERE userId = @userToId) groupUserTo " +
                    " ON groupUserFrom.roomId = groupUserTo.roomId) custom ON roomDetail.roomId = custom.roomId " +
                    " GROUP BY custom.roomId HAVING COUNT(*) = @count) and " +
                    " userId = @userFromId and status = @status ").then(result => {
                    callback(null, result.recordsets[0]);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

RoomDetails.checkExistGroupBetweenTwoUsers = async(userFromId, userToId, callback) => {

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            let defaultStatus = 1;
            let defaultCount = 2;
            await result.request()
                .input("userFromId", sql.VarChar, userFromId)
                .input("userToId", sql.VarChar, userToId)
                .input("status", sql.Int, defaultStatus)
                .input("count", sql.Int, defaultCount)
                .query("SELECT COUNT(*) as 'Count' FROM RoomDetails roomDetail RIGHT JOIN " +
                    " ( SELECT groupUserFrom.roomId FROM (SELECT roomId FROM RoomDetails " +
                    "WHERE userId = @userFromId and status = @status) groupUserFrom  JOIN " +
                    "(SELECT roomId FROM RoomDetails WHERE userId = @userToId and status = @status) groupUserTo " +
                    " ON groupUserFrom.roomId = groupUserTo.roomId) custom ON roomDetail.roomId = custom.roomId " +
                    "GROUP BY custom.roomId HAVING COUNT(*)= @count").then(result => {
                    callback(null, result.recordsets[0]);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

module.exports = RoomDetails;