import Vue from 'vue'
import App from './App.vue'
import 'es6-promise/auto'
import router from './router'
import store from './store'
import VueRouter from 'vue-router'
import Toasted from 'vue-toasted'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:8082'),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
}))
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Toasted)


new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')