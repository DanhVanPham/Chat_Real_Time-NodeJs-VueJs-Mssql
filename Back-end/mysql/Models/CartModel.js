const connection = require('../mysqlConnect.js');

var Carts = function(cart) {
    this.cartId = cart.cartId;
    this.ownerId = cart.userId;
    let d = new Date();
    this.createdAt = [d.getFullYear(), (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
        d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()
    ].join('-') + ' ' + [d.getHours() < 10 ? '0' + (d.getHours()) : d.getHours(),
        d.getMinutes() < 10 ? '0' + (d.getMinutes()) : d.getMinutes(), d.getSeconds() < 10 ? '0' + (d.getSeconds()) : d.getSeconds()
    ].join(':');
}

Carts.createNewCart = (cart, callback) => {
    var defaultStatus = 1;
    cart.status = defaultStatus;
    try {
        // connection.connect();
        connection.query("Insert into Carts(ownerId, status) VALUES ? ", [
                [
                    [cart.ownerId, cart.status]
                ]
            ],
            function(error, results) {
                if (error) { callback(error, null); } else {
                    callback(null, cart);
                }
            });
        // connection.end();
    } catch (error) {
        callback(error, null);
    }
}

Carts.getCartByCartId = (cartId, status, callback) => {

    try {
        // connection.connect();
        connection.query("SELECT * FROM Carts WHERE cartId = ? AND status = ?", [cartId, status],
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

Carts.getCartDetailsByCartId = (cartId, status, callback) => {

    try {
        // connection.connect();
        connection.query("SELECT * FROM CartDetails WHERE cartId = ? AND status = ? ", [cartId, status],
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

Carts.getCartByUserIdAndStatus = (userId, status, callback) => {
    try {
        // connection.connect();
        connection.query("SELECT * FROM Carts WHERE ownerId = ? and status = ?", [userId, status],
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

Carts.addUserIdInCartExisted = (cartId, userId, fullName, callback) => {
    var defaultStatus = 1;
    try {
        // connection.connect();
        connection.query("INSERT INTO CartDetails(cartId, userId, fullName, status) VALUES ? ", [
                [
                    [cartId, userId, fullName, defaultStatus]
                ]
            ],
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

Carts.getCartDetailByCartIdAndUserIdAndStatus = (cartId, userId, status, callback) => {

    try {
        // connection.connect();
        connection.query("SELECT * FROM CartDetails WHERE cartId = ? and userId = ? and status = ?", [cartId, userId, status],
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

Carts.deleteCart = (cartId, callback) => {
    var defaultStatus = false;
    try {
        // connection.connect();
        connection.query("UPDATE Carts SET status = ? WHERE cartId = ?", [defaultStatus, cartId],
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

Carts.removeUserExistInCart = (cartDetailId, callback) => {
    var defaultStatus = false;

    try {
        // connection.connect();
        connection.query("UPDATE CartDetails SET status = ? WHERE cartDetailId = ?", [defaultStatus, cartDetailId],
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

Carts.deleteAllCartDetailByCartId = (cartId, callback) => {
    var defaultStatus = true;
    var changeStatus = false
    try {
        // connection.connect();
        connection.query("UPDATE CartDetails SET status = ?" +
            " WHERE cartDetailId IN (SELECT cartDetailId FROM(SELECT cartDetailId FROM CartDetails WHERE cartId = ? and status = ?) as x)", [changeStatus, cartId, defaultStatus],
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

module.exports = Carts;