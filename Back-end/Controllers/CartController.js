const CartModel = require('../Models/CartModel.js');

exports.create_new_cart = (req, res) => {
    CartModel.createNewCart(req.body, (error, result) => {
        if (error) {
            res.status(400).send("Create new Cart failed!");
        } else {
            CartModel.getCartByUserIdAndStatus(result.ownerId, result.status, (err, resul) => {
                if (err) {
                    res.status(400).send("Get cart by userid and status failed!");
                }
                CartModel.addUserIdInCartExisted(resul.cartId, resul.ownerId, req.body.fullName, (er, resu) => {
                    if (er) {
                        res.status(400).send("Add user failed!");
                    }
                    res.status(200).send(resul);
                })
            })
        }
    })
}

exports.get_cart_by_userId_and_status = (req, res) => {
    CartModel.getCartByUserIdAndStatus(req.params.userId, 1, (err, resul) => {
        if (err) {
            res.status(400).send("Get cart by userid and status failed!");
        }
        if (!resul) {
            res.status(404).send("Get cart by userid and status does not found!");
        }
        res.status(200).send(resul);
    })
}

exports.add_userId_in_cart_details = (req, res) => {
    if (req.params.cartId) {
        if (req.body.ownerId && req.body.userId && req.body.fullName) {
            CartModel.getCartByUserIdAndStatus(req.body.ownerId, 1, (err, resul) => {
                if (err) {
                    res.status(400).send("Get cart by userid and status failed!");
                }
                if (!resul) {
                    res.status(404).send("Get cart by userid and status does not found!");
                } else {
                    if (resul.cartId == req.params.cartId) {
                        CartModel.getCartDetailByCartIdAndUserIdAndStatus(resul.cartId, req.body.userId, true, (error, result) => {
                            if (error) {
                                res.status(400).send("Something went wrong!");
                            }
                            if (!result) {
                                CartModel.addUserIdInCartExisted(resul.cartId, req.body.userId, req.body.fullName, (er, resu) => {
                                    if (er) {
                                        res.status(400).send("Add user failed!");
                                    }
                                    CartModel.getCartDetailByCartIdAndUserIdAndStatus(resul.cartId, req.body.userId, true, (error, result) => {
                                        if (error) {
                                            res.status(400).send("Something went wrong!");
                                        }
                                        if (result) {
                                            res.status(200).send(result);
                                        } else {
                                            res.status(404).send("Can not found cart detaild!");
                                        }
                                    })
                                })
                            } else {
                                res.status(400).send("User already exists in carts!");
                            }
                        })

                    } else {
                        res.status(400).send("Bad request!");
                    }
                }
            })
        } else {
            res.status(400).send("Bad request!");
        }
    } else {
        res.status(400).send("Bad request!");
    }
}

exports.remove_user_in_cart = (req, res) => {
    if (req.params.cartId) {
        if (req.body.ownerId && req.body.userId) {
            CartModel.getCartByUserIdAndStatus(req.body.ownerId, 1, (err, resul) => {
                if (err) {
                    res.status(400).send("Get cart by userid and status failed!");
                }
                if (!resul) {
                    res.status(404).send("Get cart by userid and status does not found!");
                } else {
                    if (resul.cartId == req.params.cartId) {
                        CartModel.getCartDetailByCartIdAndUserIdAndStatus(resul.cartId, req.body.userId, true, (error, result) => {
                            if (error) {
                                res.status(400).send("Something went wrong!");
                            }
                            if (!result) {
                                res.status(400).send("User does not exist in carts!");
                            } else {
                                CartModel.removeUserExistInCart(result.cartDetailId, (error, result) => {
                                    if (error) {
                                        res.status(400).send("Remove user exist in cart failed!");
                                    }
                                    res.status(200).send("Remove user exist in cart successfull.");
                                })
                            }
                        })

                    } else {
                        res.status(400).send("Bad request!");
                    }
                }
            })
        } else {
            res.status(400).send("Bad request!");
        }
    } else {
        res.status(400).send("Bad request!");
    }
}

exports.delete_cart_by_cartId = (req, res) => {
    if (req.params.cartId) {
        CartModel.deleteCart(req.params.cartId, (error, result) => {
            if (error) {
                res.status(400).send(error);
            }
            res.status(200).send(result);
        })
    } else {
        res.status(400).send("Bad request!");
    }
}

exports.delete_cart_detail_by_cart_detail_id = (req, res) => {
    if (req.params.cartDetailId) {
        CartModel.removeUserExistInCart(req.params.cartDetailId, (error, result) => {
            if (error) {
                return res.status(400).send("Delete cart detail failed!");
            }
            if (result) {
                return res.status(200).send("Delete cart detail successfully!");
            }
        })
    }
}

exports.get_cart_details_by_cart_id = (req, res) => {
    if (req.params.cartId) {
        CartModel.getCartDetailsByCartId(req.params.cartId, 1, (error, result) => {
            if (error) {
                return res.status(400).send("Get cart details failed!");
            }
            if (result && result.length !== 0) {
                return res.status(200).send(result);
            }
            return res.status(404).send("Get cart details does not found!");
        })
    } else {
        res.status(400).send("Bad request!");
    }
}