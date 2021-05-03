const moment = require('moment');
const bcrypt = require('bcrypt');
const config = require('../Configs/mssqlConfigs');
const sql = require('mssql');

var Users = function(user) {
    this.userId = user.userId;
    this.userName = user.userName;
    this.password = user.password;
    this.fullName = user.fullName;
    this.status = user.status;
    let d = new Date();
    this.createdAt = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    this.avatar = user.avatar;
}

Users.registerAccount = (account, callback) => {
    let userId = moment().valueOf().toString();
    let status = 1;
    bcrypt.hash(account.password, 10, (err, hash) => {
        try {
            sql.connect(config).then((connection) => {
                connection.request()
                    .input("userId", sql.VarChar, userId)
                    .input("userName", sql.VarChar, account.userName)
                    .input("fullName", sql.NVarChar, account.fullName)
                    .input("status", sql.Int, status)
                    .input("createdAt", sql.DateTime, account.createdAt)
                    .input("password", sql.VarChar, hash)
                    .input("avatar", sql.VarChar, account.avatar)
                    .query("INSERT INTO Users(userId, userName, fullName, status, createdAt, password, avatar) values(@userId, @userName, " +
                        " @fullName, @status , @createdAt , @password , @avatar)").then(result => {
                        callback(null, result);
                    }).catch(err => {
                        callback(err, null);
                    })
            })
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
                sql.connect(config).then((connection) => {
                    connection.request()
                        .input("fullName", sql.NVarChar, account.fullName)
                        .input("avatar", sql.VarChar, account.avatar)
                        .input("userId", sql.VarChar, account.userId)
                        .query("Update Users SET fullName = @fullName , avatar = @avatar WHERE userId = @userId").then((result) => {
                            callback(null, result);
                        }).catch(error => {
                            callback(error, null);
                        })
                })
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
        sql.connect(config).then((connection) => {
            connection.request()
                .input("searchName", sql.NVarChar, search)
                .input("userId", sql.VarChar, userId)
                .query("SELECT * FROM Users WHERE fullName like @searchName and userId != @userId").then((result) => {
                    callback(null, result.recordset);
                }).catch(error => {
                    callback(error, null);
                })
        })
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
                                        sql.connect(config).then((connection) => {
                                            connection.request()
                                                .input("password", sql.VarChar, hash)
                                                .input("userId", sql.VarChar, user[0].userId)
                                                .query("Update Users SET password = @password WHERE userId = @userId").then((result) => {
                                                    callback(null, result);
                                                }).catch(error => {
                                                    callback(error, null);
                                                })
                                        })
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
            sql.connect(config).then((connection) => {
                connection.request()
                    .input("userName", sql.VarChar, userName)
                    .query("Select * from Users where userName = @userName").then(result => {
                        var user = result.recordset;
                        if (user.length !== 0) {
                            callback(null, user);
                        } else {
                            callback("Can not found user by username!", null);
                        }
                    }).catch(error => {
                        callback("Can not found user by username!", null);
                    })
            })
        } catch (error) {
            callback(error, null);
        }
    } else {
        callback("Bad request!", null);
    }
}

module.exports = Users;