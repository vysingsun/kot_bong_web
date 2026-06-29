import type { RouteRecordRaw } from 'vue-router'
import LandingLayout from '../layouts/LandingLayout.vue'

export const LANDING_ROUTES: RouteRecordRaw[] = [
    {
        path: '/',
        component: LandingLayout,
        children: [
            {
                path: '',
                name: 'LandingHome',
                component: () => import('../views/LandingHomeView.vue'),
            },
        ],
    },
]
