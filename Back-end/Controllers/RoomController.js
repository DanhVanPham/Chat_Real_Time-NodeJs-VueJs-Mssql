const RoomModel = require('../mysql/Models/RoomModel.js');
const RoomDetailModel = require('../mysql/Models/RoomDetailModel.js');
const CartModel = require('../mysql/Models/CartModel.js');

exports.create_new_rooms = (req, res) => {
    var room = new RoomModel(req.body);
    if (req.body.cartId) {
        CartModel.getCartByCartId(req.body.cartId, 1, (err, resul) => {
            if (err) {
                return res.status(400).send("Get cart by cartId and status failed!");
            }
            if (!resul && resul.length === 0) {
                return res.status(404).send("Get cart by cartId and status does not found!");
            } else {
                CartModel.getCartDetailsByCartId(resul[0].cartId, 1, (error, result) => {
                    if (error) {
                        return res.status(400).send("Get Cart Details failed!");
                    } else {
                        if (!result || result.length === 0) {
                            return res.status(404).send("Get Cart Details does not found!");
                        } else {
                            var listCart = result;
                            RoomModel.createNewRoom(room, (er, rs) => {
                                if (er) {
                                    return res.status(400).send(er);
                                } else {
                                    RoomModel.getRoomByTimeCreatedAndStatus(rs, (error, resul) => {
                                        if (error) {
                                            return res.status(400).send(error);
                                        }
                                        if (!resul || resul.length === 0) {
                                            return res.status(404).send("Get Room is not available!");
                                        }
                                        RoomDetailModel.create_new_room_details_multi_users(listCart, req.body, resul[0], (error, resu) => {
                                            if (error) {
                                                return res.status(400).send(error);
                                            }
                                            if (resu) {
                                                CartModel.deleteCart(req.body.cartId, (error, result) => {
                                                    if (error) {
                                                        return res.status(400).send("Delete cart is failed!");
                                                    }
                                                    CartModel.deleteAllCartDetailByCartId(req.body.cartId, (error, result) => {
                                                        if (error) {
                                                            return res.status(400).send("Delete Cart Details failed!");
                                                        }
                                                        RoomDetailModel.getRoomDetailByUserIdAndRoomId(listCart[0].userId, resul[0].roomId, (error, result) => {
                                                            if (error) {
                                                                return res.status(400).send(error);
                                                            }
                                                            if (result && result.length !== 0) {
                                                                return res.status(200).send(result[0]);
                                                            }
                                                        })
                                                    })
                                                })
                                            }
                                        })
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    } else {
        if (req.body.userFromId && req.body.userToId) {
            RoomModel.createNewRoom(room, function callback(error, result) {
                if (error) {
                    return res.status(400).send(error);
                } else {
                    RoomModel.getRoomByTimeCreatedAndStatus(room, (erro, resul) => {
                        if (erro) {
                            return res.status(400).send(erro);
                        }
                        if (resul && resul.length !== 0) {
                            RoomDetailModel.create_new_room_details_two_users(req.body, resul[0], (err, re) => {
                                if (err) {
                                    return res.status(400).send(err);
                                }
                                RoomDetailModel.getRoomDetailByUserIdAndRoomId(req.body.userFromId, resul[0].roomId, (error, result) => {
                                    if (error) {
                                        return res.status(400).send(error);
                                    }
                                    if (result && result.length !== 0) {
                                        return res.status(200).send(result[0]);
                                    }
                                })
                            })
                        } else {
                            return res.status(404).send("Get room details failed!")
                        }
                    })
                }
            })
        } else {
            return res.status(400).send("Bad Request!");
        }
    }

}

exports.get_room_details_by_userId = (req, res) => {
    if (req.params.id) {
        RoomDetailModel.getRoomDetailsByUserId(req.params.id, (error, result) => {
            if (error) {
                return res.status(400).send("Get Room Details failed!");
            }
            if (result && result.length !== 0) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send("Get Room Details does not exists!");
            }
        })
    } else {
        return res.status(400).send("Bad Request!");
    }
}

exports.get_room_details_by_roomDetailId = (req, res) => {
    if (req.params.roomDetailId) {
        RoomDetailModel.getRoomDetailsByRoomDetailId(req.params.roomDetailId, (error, result) => {
            if (error) {
                return res.status(400).send("Get Room Details failed!");
            }
            return res.status(200).send(result);
        })
    } else {
        return res.status(400).send("Bad Request!");
    }
}

exports.checkRoomDetailBetWeenUsers = (req, res) => {
    if (req.params.userFromId && req.params.userToId) {
        RoomDetailModel.checkExistGroupBetweenTwoUsers(req.params.userFromId, req.params.userToId, (error, result) => {
            if (error) {
                return res.status(400).send("Get Room Details failed!");
            }
            if (result && result.length === 1) {
                RoomDetailModel.getRoomDetailsBetweenUsers(req.params.userFromId, req.params.userToId, (error, result) => {
                    if (error) {
                        return res.status(400).send("Get Room Details failed!");
                    }
                    if (result && result.length !== 0) {
                        return res.status(200).send(result[0]);
                    } else {
                        return res.status(404).send("Get Room Details does not found!");
                    }
                })
            } else {
                return res.status(404).send("Get Room Details does not found!");
            }
        })

    } else {
        return res.status(400).send("Bad Request!");
    }
}