import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter ({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: 'login'

        },
        {
            path: '/login',
            component: () => import('../views/AdminLogin.vue')

        },
        {
            path: '/dashboard',
            component: () => import('../views/Dashboard.vue')
        },
        {
            path: '/studentprofile',
            component: () => import('../views/Student Profile.vue')
        },
        {
            path: '/items',
            component: () => import('../views/Items.vue')
        },
        {
            path: '/pendingitems',
            component: () => import('../views/PendingItems.vue')
        },
        {
            path: '/itemrecords',
            component: () => import('../views/ItemsRecords.vue')
        }
    ]
})

export default router