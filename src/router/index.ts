import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Default_header from '@/layouts/Default_header.vue'
import { MODULE_APP_ROUTES } from '@/modules'
import { AUTH } from '@/modules/auth/router/index'
import { isAuthenticated } from '@/middlewares/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            beforeEnter: isAuthenticated,
            component: HomeView,
        },
        ...AUTH.AUTH_ROUTES,
        {
            path: '/',
            name: 'Product',
            beforeEnter: isAuthenticated,
            component: Default_header,
            children: [...MODULE_APP_ROUTES],
        },
    ],
})

export default router
