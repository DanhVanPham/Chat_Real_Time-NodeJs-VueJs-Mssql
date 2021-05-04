const moment = require('moment');
const bcrypt = require('bcrypt');
const connection = require('../mysqlConnect.js');

var Users = function(user) {
    this.userId = user.userId;
    this.userName = user.userName;
    this.password = user.password;
    this.fullName = user.fullName;
    this.status = user.status;
    let d = new Date();
    this.createdAt = [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
        d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()
    ].join('-') + ' ' + [d.getHours() < 10 ? '0' + (d.getHours()) : d.getHours(),
        d.getMinutes() < 10 ? '0' + (d.getMinutes()) : d.getMinutes(), d.getSeconds() < 10 ? '0' + (d.getSeconds()) : d.getSeconds()
    ].join(':');
    this.avatar = user.avatar;
}


Users.registerAccount = (account, callback) => {
    let userId = moment().valueOf().toString();
    let status = 1;
    bcrypt.hash(account.password, 10, (err, hash) => {
        try {
            // connection.connect();
            connection.query("INSERT INTO Users(userId, userName, fullName, status, createdAt, password, avatar) VALUES ? ", [
                    [
                        [userId, account.userName, account.fullName, status, new Date(account.createdAt), hash, account.avatar]
                    ]
                ],
                function(error, results) {
                    console.log(error);
                    console.log(results);
                    if (error) { callback(err, null); } else { callback(null, results); }
                });

            // connection.end();
        } catch (error) {
            callback(error, null);
        }
    });
}

Users.loginAccount = (account, callback) => {
    if (account.userName && account.password) {
        getUserByUserName(account.userName, (err, user) => {
            if (err) {
                callback(err, null);
            } else {
                console.log(user);
                if (user) {
                    bcrypt.compare(account.password, user[0].password, function(err, res) {
                        if (res) {
                            callback(null, user);
                        } else {
                            callback("Username or password incorrect!", null);
                        }
                    })
                } else {
                    callback("Can not found user by username!", null);
                }
            }
        })
    } else {
        let error = "Require input all field!";
        callback(error, null);
    }
}

Users.editProfile = (userId, account, callback) => {
    if (account.fullName) {
        if (userId === account.userId) {
            try {
                // connection.connect();
                connection.query("Update Users SET fullName = ? , avatar = ? WHERE userId = ? ", [account.fullName, account.avatar, account.userId],
                    function(error, results) {
                        if (error) { callback(err, null); } else { callback(null, results); }
                    });

                // connection.end();

            } catch (error) {
                callback(error, null);
            }
        } else {
            callback("Bad request!", null);
        }
    } else {
        callback("Require input all field!", null);
    }
}

Users.searchByName = (userId, search, callback) => {
    if (!search) {
        search = "%%";
    } else {
        search += "%";
    }
    try {
        // connection.connect();

        connection.query("SELECT * FROM Users WHERE fullName like ? and userId != ?", [search, userId],
            function(error, results) {
                if (error) { callback(error, null); } else {
                    callback(null, results);
                }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }
}

Users.changePassword = (account, callback) => {
    if (account.userName && account.oldPassword && account.newPassword && account.confirmPassword) {
        if (account.oldPassword === account.confirmPassword) {
            getUserByUserName(account.userName, (err, user) => {
                if (err) {
                    callback(err, null);
                } else {
                    if (user) {
                        bcrypt.compare(account.oldPassword, user[0].password, function(err, res) {
                            if (res) {
                                bcrypt.hash(account.newPassword, 10, (err, hash) => {
                                    try {
                                        connection.query("Update Users SET password = ? WHERE userId = ?", [hash, user[0].userId],
                                            function(error, results) {
                                                if (error) { callback(error, null); } else { callback(null, results) }
                                            });

                                        // connection.end();
                                    } catch (error) {
                                        callback(error, null);
                                    }
                                })
                            } else {
                                callback("OldPassword incorrect!", null);
                            }
                        })
                    } else {
                        callback("Can not found user by username!", null);
                    }
                }
            })
        } else {
            callback("Old-Password and Confirm-Password doesn't match!", null);
        }
    } else {
        callback("Not allow!", null);
    }
}

function getUserByUserName(userName, callback) {
    if (userName) {
        try {
            // connection.connect();
            connection.query("Select * from Users where userName = ?", [
                    [userName]
                ],
                function(error, results) {
                    if (error) { callback(error, null); } else { callback(null, results) }
                });

            // connection.end();
        } catch (error) {
            callback(error, null);
        }
    } else {
        callback("Bad request!", null);
    }
}

module.exports = Users;