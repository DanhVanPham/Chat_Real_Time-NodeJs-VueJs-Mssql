import 'es6-promise';
import AuthService from '../../../services/AuthServices';
import { SET_USERS, SET_USER } from '../user/mutation-type';
const state = {
    user: {},
    users: [],
};

const getters = {
    user(state) { return state.user },
    users(state) {
        return state.users;
    }
};

const mutations = {
    [SET_USERS]: (state, credentials) => {
        state.users = credentials;
    },
    [SET_USER]: (state, credentials) => {
        state.user = credentials;
    }
};

const actions = {
    async login({ commit }, credentials) {
        try {
            var response = await AuthService.login(credentials);
            if (response.status == 200) {
                await commit(SET_USER, response.data);
                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("avatar", response.data.avatar);
                localStorage.setItem("fullName", response.data.fullName);
                return response.status;
            }
        } catch (err) {
            await commit(SET_USER, "");
            return 400;
        }
    },
    async logout({ commit }) {
        try {
            var response = await AuthService.logoutUser();
            if (response.status == 200) {
                await commit(SET_USER, "");
                localStorage.clear();
                return response.status;
            }
        } catch (err) {
            return 400;
        }
    },
    async register({ commit }, credentials) {
        try {
            var user = {
                userName: credentials.userName,
                password: credentials.password,
                fullName: credentials.fullName,
                avatar: credentials.avatar,
            }
            var response = await AuthService.registerUser(user);
            if (response.status === 200) {
                await commit(SET_USER, "");
                return response.status;
            } else {
                return response.status;
            }
        } catch (err) {
            return 400;
        }

    },
    async searchUsers({ commit }, credentials) {
        try {
            var response = await AuthService.searchUserByName(credentials);
            if (response.status === 200) {
                await commit(SET_USERS, response.data);
                return response.status;
            } else {
                await commit(SET_USERS, "");
                return response.status;
            }
        } catch (error) {
            await commit(SET_USERS, "");
            if (error.response.status === 403) {
                return 403;
            }
            return 400;
        }
    }
};

export default {
    namespaced: true,
    getters,
    state,
    mutations,
    actions,
}