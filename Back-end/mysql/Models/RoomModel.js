const connection = require('../mysqlConnect.js');

var Rooms = function(room) {
    this.roomId = room.roomId;
    let d = new Date();
    this.createdAt = [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
        d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()
    ].join('-') + ' ' + [d.getHours() < 10 ? '0' + (d.getHours()) : d.getHours(),
        d.getMinutes() < 10 ? '0' + (d.getMinutes()) : d.getMinutes(), d.getSeconds() < 10 ? '0' + (d.getSeconds()) : d.getSeconds()
    ].join(':');
    this.status = room.status;
}


Rooms.createNewRoom = (room, callback) => {
    var defaultStatus = 1;
    room.status = defaultStatus;
    try {
        // connection.connect();
        connection.query("INSERT INTO Rooms(createdAt , status) VALUES ? ", [
                [
                    [new Date(room.createdAt), defaultStatus]
                ]
            ],
            function(error, results) {
                if (error) { callback(error, null); } else { callback(null, room) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }
}

Rooms.getRoomByTimeCreatedAndStatus = (room, callback) => {
    try {
        // connection.connect();
        console.log(room.createdAt)
        connection.query("SELECT * FROM Rooms WHERE createdAt = ? and status = ?", [new Date(room.createdAt), room.status],
            function(error, results) {
                console.log(error);
                console.log(results)
                if (error) { callback(error, null); } else { callback(null, results) }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }
}


module.exports = Rooms;