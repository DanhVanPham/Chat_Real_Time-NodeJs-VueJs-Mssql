import Vue from 'vue';
import VueRouter from 'vue-router';
import FirstPage from '../views/HelloWorld.vue';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import User from '../views/User.vue';

Vue.use(VueRouter);

const routes = [{
        path: '/',
        name: "FirstPage",
        component: FirstPage
    },
    {
        path: '/login',
        name: "Login",
        component: Login
    },
    {
        path: '/register',
        name: "Register",
        component: Register
    },
    {
        path: '/users',
        name: "User",
        component: User
    }
]

const router = new VueRouter({
    mode: 'history',
    routes,
    base: process.env.BASE_URL
})

export default router;