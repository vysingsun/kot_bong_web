import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { MODULE_APP_ROUTES } from '@/modules/'
import { isAuthenticated } from '@/middlewares/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: isAuthenticated,
      component: HomeView
    },
    ...MODULE_APP_ROUTES
  ]
})

export default router
