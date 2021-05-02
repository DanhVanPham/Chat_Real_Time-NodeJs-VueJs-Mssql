const sql = require('mssql');
const connection = require('./db.js');
const moment = require('moment');

var Carts = function(cart) {
    this.cartId = cart.cartId;
    this.ownerId = cart.userId;
    let d = new Date();
    this.createdAt = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    this.status = room.status;
}

Carts.createNewCart = async(cart, callback) => {
    var defaultStatus = 1;
    cart.status = defaultStatus;
    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("ownerId", sql.VarChar, cart.ownerId)
                .input("status", sql.Bit, cart.status)
                .query("Insert into Carts(ownerId, status) values(@ownerId, @status)").then((result) => {
                    callback(null, cart);
                }).catch((err) => {
                    callback(err, null);
                });
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.getCartByCartId = async(cartId, status, callback) => {

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("cartId", sql.Int, cartId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM Carts WHERE cartId = @cartId AND status = @status").then(result => {
                    callback(null, result.recordset[0]);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.getCartDetailsByCartId = async(cartId, status, callback) => {

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("cartId", sql.Int, cartId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM CartDetails WHERE cartId = @cartId AND status = @status ").then(result => {
                    callback(null, result.recordset);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.getCartByUserIdAndStatus = async(userId, status, callback) => {

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("ownerId", sql.VarChar, userId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM Carts WHERE ownerId = @ownerId and status = @status").then(result => {
                    console.log(2);
                    console.log(result);
                    callback(null, result.recordset[0]);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.addUserIdInCartExisted = async(cartId, userId, fullName, callback) => {
    var defaultStatus = 1;

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("cartId", sql.Int, cartId)
                .input("userId", sql.VarChar, userId)
                .input("fullName", sql.NVarChar, fullName)
                .input("status", sql.Bit, defaultStatus)
                .query("INSERT INTO CartDetails(cartId, userId, fullName, status) values(@cartId, @userId, @fullName, @status)").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.getCartDetailByCartIdAndUserIdAndStatus = async(cartId, userId, status, callback) => {

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("cartId", sql.Int, cartId)
                .input("userId", sql.VarChar, userId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM CartDetails WHERE cartId = @cartId and userId = @userId and status = @status").then(result => {
                    callback(null, result.recordset[0]);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.deleteCart = async(cartId, callback) => {
    var defaultStatus = false;

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("status", sql.Bit, defaultStatus)
                .input("cartId", sql.Int, cartId)
                .query("UPDATE Carts SET status = @status WHERE cartId = @cartId").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.removeUserExistInCart = async(cartDetailId, callback) => {
    var defaultStatus = false;

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("status", sql.Bit, defaultStatus)
                .input("cartDetailId", sql.Int, cartDetailId)
                .query("UPDATE CartDetails SET status = @status WHERE cartDetailId = @cartDetailId").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

Carts.deleteAllCartDetailByCartId = async(cartId, callback) => {
    var defaultStatus = true;
    var changeStatus = false

    await connection.getConnection(async(error, result) => {
        if (error) {
            callback("Connection to mssql server failed!", null);
        }
        if (result) {
            await result.request()
                .input("cartId", sql.Int, cartId)
                .input("status", sql.Bit, defaultStatus)
                .input("changeStatus", sql.Bit, changeStatus)
                .query("UPDATE CartDetails SET status = @changeStatus" +
                    "' WHERE cartDetailId IN (SELECT cartDetailId FROM CartDetails WHERE cartId = @cartId and status = @status)").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        }
    }).finally(() => {
        connection.closeConnection();
    })

}

module.exports = Carts;