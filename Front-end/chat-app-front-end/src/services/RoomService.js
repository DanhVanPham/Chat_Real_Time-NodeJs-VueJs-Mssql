import {get, post } from '../utils/apiCaller';

class RoomService {
    async getRoomDetailsByUserId(userId) {
        return await get(`/rooms/users/${userId}`, {}, {});
    }

    async checkRoomDetailsExistBetweenTwoUsers(credentials) {
        return await get(`/rooms/roomDetails/users/${credentials.userFromId}/${credentials.userToId}`, {}, {});
    }

    async createNewRoom(credentials) {
        return await post('/rooms', {}, credentials, {});
    }
}

export default new RoomService();