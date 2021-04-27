import { post, get } from '../utils/apiCaller';

class MessageService {
    async getListMessageByRoomDetailId(roomDetailId) {
        return await get(`/messages/roomDetails/${roomDetailId}`, {}, {});
    }

    async createNewMessage(credentials) {
        return await post(`/messages`, {}, credentials, {});
    }
}
export default new MessageService();