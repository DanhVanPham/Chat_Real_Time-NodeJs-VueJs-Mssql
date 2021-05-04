import {get, post, remove } from '../utils/apiCaller';

class CartService {
    async getCartByOwnerId(ownerId) {
        console.log(ownerId)
        return await get(`/carts/users/${ownerId}`, {}, {});
    }

    async createCartByOwner(credentials) {
        return await post(`/carts`, {}, credentials, {});
    }

    async addUserInCartExisted(credentials) {
        return await post(`/carts/${credentials.cartId}`, {}, credentials, {});
    }

    async getAllCartDetails(credentials) {
        return await get(`/carts/${credentials}`, {}, {});
    }

    async removeCartDetailsByCartDetailId(credential) {
        return await remove(`/carts/cartDetails/${credential}`, {}, {}, {});
    }

}

export default new CartService();