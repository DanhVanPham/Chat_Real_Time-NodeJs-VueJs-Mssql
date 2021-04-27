import {get } from '../utils/apiCaller';

class RoomService {
    async getRoomDetailsByUserId(userId) {
        return await get(`/rooms/users/${userId}`, {}, {});
    }

    async checkRoomDetailsExistBetweenTwoUsers(credentials) {
        console.log(credentials);
        return await get(`/rooms/roomDetails/users/${credentials.userFromId}/${credentials.userToId}`, {}, {});
    }
}

export default new RoomService();