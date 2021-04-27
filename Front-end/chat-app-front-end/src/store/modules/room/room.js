import RoomService from '../../../services/RoomService';
import { SET_ROOM_DETAILS, CURRENT_ROOM_DETAIL, ADD_ROOM_DETAIL } from '../room/mutation-type';

const state = {
    roomDetails: [],
    currentRoomDetail: "",
};

const getters = {
    roomDetails(state) { return state.roomDetails },
    currentRoomDetail(state) { return state.currentRoomDetail },
};

const mutations = {
    [SET_ROOM_DETAILS]: (state, credentials) => {
        state.roomDetails = credentials;
    },
    [CURRENT_ROOM_DETAIL]: (state, credentials) => {
        state.currentRoomDetail = credentials;
    },
    [ADD_ROOM_DETAIL]: (state, credentials) => {
        state.roomDetails.push(credentials);
    }
};

const actions = {
    async getRoomByUser({ commit }, credential) {
        try {
            var response = await RoomService.getRoomDetailsByUserId(credential);
            if (response.status === 200) {
                await commit(SET_ROOM_DETAILS, response.data);
                return response.status;
            } else {
                await commit(SET_ROOM_DETAILS, "");
                return response.status;
            }
        } catch (error) {
            await commit(SET_ROOM_DETAILS, "");
            return 400;
        }
    },

    async checkRoomDetailsExist({ commit }, credentials) {
        try {
            var response = await RoomService.checkRoomDetailsExistBetweenTwoUsers(credentials);
            if (response.status === 200) {
                await commit(CURRENT_ROOM_DETAIL, response.data);
                return response.status;
            } else {
                return response.status;
            }
        } catch (error) {
            return 400;
        }
    },

    async createRoomDetails({ commit }, credentials) {
        try {
            var response = await RoomService.createNewRoom(credentials);
            console.log(response.data);
            if (response.status === 200) {
                await commit(ADD_ROOM_DETAIL, response.data);
                await commit(CURRENT_ROOM_DETAIL, response.data);
                return response.status;
            } else {
                return response.status;
            }
        } catch (error) {
            return 400;
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}