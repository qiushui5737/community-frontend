import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/owner',
        component: () => import('@/views/owner/Layout.vue'),
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: '/owner/home' },
            { path: 'home', component: () => import('@/views/owner/OwnerHome.vue'), meta: { title: '业主首页' } },
            {
                path: 'bills',
                name: 'OwnerBills',
                component: () => import('@/views/owner/OwnerBills.vue'),
                meta: { title: '在线缴费' }
            }
        ]
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/admin/Layout.vue'),
        meta: { requiresAuth: true }, // 需要登录
        children: [
            {
                path: '', // 默认跳转
                redirect: '/admin/dashboard'
            },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/admin/Dashboard.vue'),
                meta: { title: '数据概览' }
            },
            {
                path: 'users',
                name: 'UserManage',
                component: () => import('@/views/admin/UserManage.vue'),
                meta: { title: '用户管理' }
            },
            {
                path: 'fee',
                name: 'FeeManage',
                component: () => import('@/views/admin/FeeManage.vue'),
                meta: { title: '费用管理' }
            },
            {
                path: 'building-house',
                name: 'BuildingHouseManage',
                component: () => import('@/views/admin/BuildingHouseManage.vue'),
                meta: { title: '楼栋房屋管理' }
            },
            {
                path: 'building-visual',
                name: 'BuildingVisual',
                component: () => import('@/views/admin/BuildingVisual.vue'),
                meta: { title: '楼栋平面图' }
            },

        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router
