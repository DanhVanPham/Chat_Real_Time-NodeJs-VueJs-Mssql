import { post, get, put } from '../utils/apiCaller';

class AuthService {
    async login(credentials) {
        return await post("/users/login", {}, credentials, {});
    }
    async logoutUser() {
        return await post("/users/logout", {}, {}, {});
    }
    async registerUser(credentials) {
        return await post("/users", {}, credentials, {});
    }

    async searchUserByName(credentials) {
        return await get(`/users/${credentials.userId}/${credentials.searchName}`, {}, {});
    }

    async editProfile(credentials) {
        return await put(`/users/${credentials.userId}`, {}, credentials, {});
    }
}

export default new AuthService();