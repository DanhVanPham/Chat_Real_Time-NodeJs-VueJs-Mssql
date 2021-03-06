import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import User from '../views/User.vue';
import Profile from '../views/Profile.vue';

Vue.use(VueRouter);

const routes = [{
        path: '/',
        name: "Login",
        component: Login
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
    },
    {
        path: '/profile',
        name: "Profile",
        component: Profile
    }
]

const router = new VueRouter({
    mode: 'history',
    routes,
    base: process.env.BASE_URL
})

export default router;