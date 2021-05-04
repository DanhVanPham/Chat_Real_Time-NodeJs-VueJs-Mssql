import { SET_MESSAGES, ADD_MESSAGE } from '../message/mutation-type';
import MessageService from '../../../services/MessageService';

const state = {
    messages: [],
}

const getters = {
    messages(state) { return state.messages },
}

const mutations = {
    [SET_MESSAGES]: (state, credential) => {
        state.messages = credential;
    },
    [ADD_MESSAGE]: (state, credential) => {
        state.messages = state.messages || [];
        state.messages.push(credential);
    }
}

const actions = {
    async getListMessagesByRoomDetail({ commit }, credential) {
        try {
            var response = await MessageService.getListMessageByRoomDetailId(credential);
            if (response.status === 200) {
                await commit(SET_MESSAGES, response.data);
                return response.status;
            } else {
                await commit(SET_MESSAGES, "");
                return response.status;
            }
        } catch (error) {
            await commit(SET_MESSAGES, "");
            if (error.response.status === 403) {
                return 403;
            }
            return 400;
        }
    },

    async createMessage({ commit }, credential) {
        try {
            var response = await MessageService.createNewMessage(credential);
            if (response.status === 200) {
                await commit(ADD_MESSAGE, credential);
                return response.status;
            } else {
                return response.status;
            }
        } catch (error) {
            if (error.response.status === 403) {
                return 403;
            }
            return 400;
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}