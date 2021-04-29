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

Carts.createNewCart = (cart, callback) => {
    var defaultStatus = 1;
    cart.status = defaultStatus;
    connection.then(() => {
        return sql.query("Insert into Carts(ownerId, status) values('" + cart.ownerId + "', " + cart.status + ")");
    }).then((result) => {
        callback(null, cart);
    }).catch((err) => {
        callback(err, null);
    });
}

Carts.getCartByCartId = (cartId, status, callback) => {
    connection.then(() => {
        return sql.query("SELECT * FROM Carts WHERE cartId = " + cartId + " AND status = " + status);
    }).then(result => {
        callback(null, result.recordset[0]);
    }).catch(error => {
        callback(error, null);
    })
}

Carts.getCartDetailsByCartId = (cartId, status, callback) => {
    connection.then(() => {
        return sql.query("SELECT * FROM CartDetails WHERE cartId = " + cartId + " AND status = " + status);
    }).then(result => {
        callback(null, result.recordset);
    }).catch(error => {
        callback(error, null);
    })
}

Carts.getCartByUserIdAndStatus = (userId, status, callback) => {
    connection.then(() => {
        return sql.query("SELECT * FROM Carts WHERE ownerId = '" + userId + "' and status = " + status);
    }).then(result => {
        callback(null, result.recordset[0]);
    }).catch(error => {
        callback(error, null);
    })
}

Carts.addUserIdInCartExisted = (cartId, userId, fullName, callback) => {
    var defaultStatus = 1;
    connection.then(() => {
        return sql.query("INSERT INTO CartDetails(cartId, userId, fullName, status) values('" + cartId + "', '" + userId + "', N'" + fullName + "' , " + defaultStatus + ")")
    }).then(result => {
        callback(null, result);
    }).catch(error => {
        callback(error, null);
    })
}

Carts.getCartDetailByCartIdAndUserIdAndStatus = (cartId, userId, status, callback) => {
    connection.then(() => {
        return sql.query("SELECT * FROM CartDetails WHERE cartId = " + cartId + " and userId = '" + userId + "' and status = '" + status + "'")
    }).then(result => {
        callback(null, result.recordset[0]);
    }).catch(error => {
        callback(error, null);
    })
}

Carts.deleteCart = (cartId, callback) => {
    var defaultStatus = false;
    connection.then(() => {
        return sql.query("UPDATE Carts SET status = '" + defaultStatus + "' WHERE cartId = '" + cartId + "'")
    }).then(result => {
        callback(null, result);
    }).catch(error => {
        callback(error, null);
    })
}

Carts.removeUserExistInCart = (cartDetailId, callback) => {
    var defaultStatus = false;
    connection.then(() => {
        return sql.query("UPDATE CartDetails SET status = '" + defaultStatus + "' WHERE cartDetailId = " + cartDetailId);
    }).then(result => {
        callback(null, result);
    }).catch(error => {
        callback(error, null);
    })
}

Carts.deleteAllCartDetailByCartId = (cartId, callback) => {
    var defaultStatus = true;
    var changeStatus = false
    connection.then(() => {
        return sql.query("UPDATE CartDetails SET status = '" + changeStatus + "' WHERE cartDetailId IN (SELECT cartDetailId FROM CartDetails WHERE cartId = " + cartId + " and status = '" + defaultStatus + "')")
    }).then(result => {
        callback(null, result);
    }).catch(error => {
        callback(error, null);
    })
}

module.exports = Carts;