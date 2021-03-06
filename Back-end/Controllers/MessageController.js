const MessageModel = require('../mysql/Models/MessageModel.js');
const RoomDetailModel = require('../mysql/Models/RoomDetailModel.js');

exports.createNewMessage = (req, res) => {
    if (req.body.content && req.body.sender && req.body.roomId) {
        var { sender, roomId } = req.body;
        RoomDetailModel.getRoomDetailByUserIdAndRoomId(sender, roomId, (error, result) => {
            if (error) {
                return res.status(400).send("Get RoomDetail failed!");
            }

            if (!result || result.length === 0) {
                return res.status(404).send("Get Room Detail doesn't found!");
            } else {
                var message = new MessageModel(req.body);
                MessageModel.create_new_message(message, result[0], (error, result) => {
                    if (error) {
                        return res.status(400).send("Create new message failed!");
                    }

                    if (result) {
                        return res.status(200).send("Create new message successfully.");
                    }
                })
            }
        })

    } else {
        return res.status(400).send("Bad request!");
    }
}

exports.getListMessageByRoomDetailId = (req, res) => {
    if (req.params.roomDetailId) {
        MessageModel.get_list_messages_by_room_detail(req.params.roomDetailId, (error, result) => {
            if (error) {
                return res.status(400).send("Get list message by room detail ID failed!");
            }
            if (result && result.length !== 0) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send("Get list message by room detail Id does not found!");
            }
        })
    } else {
        return res.status(400).send("Bad Request!");
    }

}