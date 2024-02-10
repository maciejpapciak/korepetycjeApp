import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Browse from '../views/Browse.vue'
import Profile from '../views/Profile.vue'
import Favorite from '../views/Favorite.vue'
import CreateEditOffer from '../views/CreateEditOffer.vue'
import Logout from '../views/Logout.vue'
import Verify from '../views/Verify.vue'
import Admin from '../views/Admin.vue'
import Ranking from '../views/Ranking.vue'
import ViewOffer from '../views/ViewOffer.vue'
import AddCalendar from '../views/AddCalendar.vue'

const routes = [
    {
        path: '/',
        name: 'Browse',
        component: Browse,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/offer/:id',
        name: 'Offer',
        component: ViewOffer,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            requiresVisitor: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            requiresVisitor: true
        }
    },
    {
        path: '/verify/:email/:token',
        name: 'Verify',
        component: Verify,
        meta: {
            requiresVisitor: true
        }
    },
    {
        path: '/logout',
        name: 'Logout',
        component: Logout,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/profile/:id',
        name: 'Profile',
        component: Profile,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/addcalendar',
        name: 'addcalendar',
        component: AddCalendar,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/ranking',
        name: 'Ranking',
        component: Ranking,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: {
            requiresAdmin: true
        }
    },
    {
        path: '/favorite',
        name: 'Favorite',
        component: Favorite,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/create-offer',
        name: 'CreateEditOffer',
        component: CreateEditOffer,
        props: (route) => ({
            ...route.params
        }),
        meta: {
            requiresAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router