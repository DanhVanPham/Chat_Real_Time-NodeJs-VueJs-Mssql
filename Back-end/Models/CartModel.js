const config = require('../Configs/mssqlConfigs');
const sql = require('mssql');
const moment = require('moment');

var Carts = function(cart) {
    this.cartId = cart.cartId;
    this.ownerId = cart.userId;
    let d = new Date();
    this.createdAt = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
    this.status = room.status;
}

Carts.createNewCart = (cart, callback) => {
    var defaultStatus = 1;
    cart.status = defaultStatus;
    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("ownerId", sql.VarChar, cart.ownerId)
                .input("status", sql.Bit, cart.status)
                .query("Insert into Carts(ownerId, status) values(@ownerId, @status)").then((result) => {
                    callback(null, cart);
                }).catch((err) => {
                    callback(err, null);
                }).then(() => {})
        })
    } catch (error) {
        console.log(error);
    }
}

Carts.getCartByCartId = (cartId, status, callback) => {

    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("cartId", sql.Int, cartId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM Carts WHERE cartId = @cartId AND status = @status").then(result => {
                    callback(null, result.recordset[0]);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

Carts.getCartDetailsByCartId = (cartId, status, callback) => {


    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("cartId", sql.Int, cartId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM CartDetails WHERE cartId = @cartId AND status = @status ").then(result => {
                    callback(null, result.recordset);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

Carts.getCartByUserIdAndStatus = (userId, status, callback) => {

    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("ownerId", sql.VarChar, userId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM Carts WHERE ownerId = @ownerId and status = @status").then(result => {
                    console.log(2);
                    console.log(result);
                    callback(null, result.recordset[0]);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

Carts.addUserIdInCartExisted = (cartId, userId, fullName, callback) => {
    var defaultStatus = 1;
    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("cartId", sql.Int, cartId)
                .input("userId", sql.VarChar, userId)
                .input("fullName", sql.NVarChar, fullName)
                .input("status", sql.Bit, defaultStatus)
                .query("INSERT INTO CartDetails(cartId, userId, fullName, status) values(@cartId, @userId, @fullName, @status)").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

Carts.getCartDetailByCartIdAndUserIdAndStatus = (cartId, userId, status, callback) => {


    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("cartId", sql.Int, cartId)
                .input("userId", sql.VarChar, userId)
                .input("status", sql.Bit, status)
                .query("SELECT * FROM CartDetails WHERE cartId = @cartId and userId = @userId and status = @status").then(result => {
                    callback(null, result.recordset[0]);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

Carts.deleteCart = (cartId, callback) => {
    var defaultStatus = false;


    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("status", sql.Bit, defaultStatus)
                .input("cartId", sql.Int, cartId)
                .query("UPDATE Carts SET status = @status WHERE cartId = @cartId").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

Carts.removeUserExistInCart = (cartDetailId, callback) => {
    var defaultStatus = false;


    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("status", sql.Bit, defaultStatus)
                .input("cartDetailId", sql.Int, cartDetailId)
                .query("UPDATE CartDetails SET status = @status WHERE cartDetailId = @cartDetailId").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

Carts.deleteAllCartDetailByCartId = (cartId, callback) => {
    var defaultStatus = true;
    var changeStatus = false


    try {
        sql.connect(config).then((connection) => {
            connection.request()
                .input("cartId", sql.Int, cartId)
                .input("status", sql.Bit, defaultStatus)
                .input("changeStatus", sql.Bit, changeStatus)
                .query("UPDATE CartDetails SET status = @changeStatus" +
                    "' WHERE cartDetailId IN (SELECT cartDetailId FROM CartDetails WHERE cartId = @cartId and status = @status)").then(result => {
                    callback(null, result);
                }).catch(error => {
                    callback(error, null);
                })
        })
    } catch (error) {
        console.log(error);
    }

}

module.exports = Carts;