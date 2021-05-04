import { SET_CART, ADD_CART_DETAILS, SET_CART_DETAILS, DELETE_CART_DETAIL } from './mutation-type';
import CartService from '../../../services/CartService';

const state = {
    cart: "",
    cartDetails: [],
};

const getters = {
    cart(state) { return state.cart },
    cartDetails(state) { return state.cartDetails },
};

const mutations = {
    [SET_CART]: (state, credentials) => {
        state.cart = credentials;
    },
    [ADD_CART_DETAILS]: (state, credentials) => {
        state.cartDetails = state.cartDetails || [];
        state.cartDetails.push(credentials);
    },
    [SET_CART_DETAILS]: (state, credentials) => {
        state.cartDetails = credentials;
    },
    [DELETE_CART_DETAIL]: async(state, credentials) => {
        let cartDetails = await state.cartDetails.filter(function(cartDetail) {
            return cartDetail.cartDetailId !== credentials;
        });
        state.cartDetails = cartDetails;
    }
};

const actions = {
    async getCartByUserId({ commit }, credentials) {
        try {
            let response = await CartService.getCartByOwnerId(credentials);
            if (response.status === 200) {
                await commit(SET_CART, response.data);
                return response.status;
            } else {
                await commit(SET_CART, "");
                return response.status;
            }
        } catch (error) {
            await commit(SET_CART, "");
            if (error.response.status === 403) {
                return 403;
            }
            return 400;
        }
    },
    async createNewCart({ commit }, credentials) {
        try {
            let response = await CartService.createCartByOwner(credentials);
            if (response.status === 200) {
                await commit(SET_CART, response.data);
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
    },

    async addUserInCart({ commit }, credentials) {
        try {
            let response = await CartService.addUserInCartExisted(credentials);
            if (response.status === 200) {
                await commit(ADD_CART_DETAILS, response.data);
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
    },

    async getCartDetails({ commit }, credential) {
        try {
            let response = await CartService.getAllCartDetails(credential);
            if (response.status === 200) {
                await commit(SET_CART_DETAILS, response.data);
                return response.status;
            } else {
                await commit(SET_CART_DETAILS, "");
                return response.status;
            }
        } catch (error) {
            await commit(SET_CART_DETAILS, "");
            if (error.response.status === 403) {
                return 403;
            }
            return 400;
        }
    },

    async deleteCartDetailByCartDetailId({ commit }, credential) {
        try {
            let response = await CartService.removeCartDetailsByCartDetailId(credential);
            if (response.status === 200) {
                await commit(DELETE_CART_DETAIL, credential);
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
    },

};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}