import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import user from '../store/modules/user/user';
import room from '../store/modules/room/room';
import message from '../store/modules/message/message';
import cart from '../store/modules/cart/cart';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        room,
        message,
        cart,
    },
    plugins: [createPersistedState()]
})