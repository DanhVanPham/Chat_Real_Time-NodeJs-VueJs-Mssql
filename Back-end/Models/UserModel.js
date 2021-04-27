const connection = require('../Models/db.js');
const sql = require('mssql');
const moment = require('moment');
const bcrypt = require('bcrypt');

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
        connection.then(() => {
            return sql.query("INSERT INTO Users(userId, userName, fullName, status, createdAt, password, avatar) values('" +
                userId + "', '" + account.userName + "', N'" +
                account.fullName + "', " +
                status + ", '" + account.createdAt + "' , '" + hash + "', '" + account.avatar + "')");
        }).then(result => {
            callback(null, result);
        }).catch(err => {
            callback(err, null);
        })
    });
}

Users.loginAccount = (account, callback) => {
    if (account.userName && account.password) {
        getUserByUserName(account.userName, (err, user) => {
            if (err) {
                callback(err, null);
            } else {
                if (user) {
                    bcrypt.compare(account.password, user[0].password, function async(err, res) {
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
            connection.then(() => {
                return sql.query("Update Users SET fullName = '" + account.fullName + "', avatar = '" + account.avatar +
                    "' WHERE userId = '" + account.userId + "'");
            }).then((result) => {
                callback(null, result);
            }).catch(error => {
                callback(error, null);
            })
        } else {
            callback("Bad request!", null);
        }
    } else {
        callback("Require input all field!", null);
    }
}

Users.searchByName = (name, callback) => {
    if (!name) {
        name = "";
    }
    connection.then(() => {
        return sql.query("SELECT * FROM Users WHERE fullName like '" + name + "%'");
    }).then((result) => {
        callback(null, result.recordset);
    }).catch(error => {
        callback(error, null);
    })
}

Users.changePassword = (account, callback) => {
    if (account.userName && account.oldPassword && account.newPassword && account.confirmPassword) {
        if (account.oldPassword === account.confirmPassword) {
            getUserByUserName(account.userName, (err, user) => {
                if (err) {
                    callback(err, null);
                } else {
                    if (user) {
                        bcrypt.compare(account.oldPassword, user[0].password, function async(err, res) {
                            if (res) {
                                bcrypt.hash(account.newPassword, 10, (err, hash) => {
                                    connection.then(() => {
                                        return sql.query("Update Users SET password = '" + hash + "' WHERE userId = '" + user[0].userId + "'");
                                    }).then((result) => {
                                        callback(null, result);
                                    }).catch(error => {
                                        callback(error, null);
                                    })
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
        connection.then(() => {
            return sql.query("Select * from Users where userName = '" + userName + "'");
        }).then(result => {
            var user = result.recordset;
            if (user) {
                callback(null, user);
            } else {
                callback("Can not found user by username!", null);
            }
        }).catch(error => {
            callback("Can not found user by username!", null);
        })
    } else {
        callback("Bad request!", null);
    }
}

module.exports = Users;