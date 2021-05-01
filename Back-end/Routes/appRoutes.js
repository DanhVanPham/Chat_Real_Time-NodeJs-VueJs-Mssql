const baseUrl = '/v1/api';
const userController = require('../Controllers/UserController.js');
const roomController = require('../Controllers/RoomController.js');
const cartController = require('../Controllers/CartController.js');
const messageController = require('../Controllers/MessageController.js');

module.exports = (app) => {
    /* User Controller */
    app.route(baseUrl + '/users').post(userController.create_new_user)
    app.route(baseUrl + '/users/:id').put(userController.edit_profile)
    app.route(baseUrl + '/users/login').post(userController.login_user_password)
    app.route(baseUrl + '/users/logout').post(userController.logout);
    app.route(baseUrl + '/users/change-pass').patch(userController.change_password);
    app.route(baseUrl + '/users/:userId/:search').get(userController.searchUserByName);

    /*Room Controller */
    app.route(baseUrl + '/rooms').post(roomController.create_new_rooms);
    app.route(baseUrl + '/rooms/users/:id').get(roomController.get_room_details_by_userId);
    app.route(baseUrl + '/rooms/roomDetails/:roomDetailId').get(roomController.get_room_details_by_roomDetailId);
    app.route(baseUrl + '/rooms/roomDetails/users/:userFromId/:userToId').get(roomController.checkRoomDetailBetWeenUsers);


    /*Carts Controller */
    app.route(baseUrl + '/carts').post(cartController.create_new_cart)
    app.route(baseUrl + '/carts/users/:userId').get(cartController.get_cart_by_userId_and_status)
    app.route(baseUrl + '/carts/:cartId').delete(cartController.delete_cart_by_cartId)
        .post(cartController.add_userId_in_cart_details)
        .patch(cartController.remove_user_in_cart).get(cartController.get_cart_details_by_cart_id);

    /*Cart Detail Controller */
    app.route(baseUrl + '/carts/cartDetails/:cartDetailId').delete(cartController.delete_cart_detail_by_cart_detail_id);

    /*Messages Controller */
    app.route(baseUrl + '/messages').post(messageController.createNewMessage);
    app.route(baseUrl + '/messages/roomDetails/:roomDetailId').get(messageController.getListMessageByRoomDetailId);
}