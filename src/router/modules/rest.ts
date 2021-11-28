import Layout from '@/layout/index.vue'

const restRouter = [
    {
        path: "/redirect",
        name: "redirect",
        meta: { show: false, keepAlive: false },
        component: Layout,
        children: [
            {
                path: "/redirect/:path(.*)",
                name: "redirect",
                meta: { show: false, keepAlive: false },
                component: () => import("@/layout/components/redirect.vue"),
            }
        ]
    },
    {
        path: "/login",
        name: "login",
        meta: { show: false },
        component: () => import("@/views/other/login.vue"),
    },
    {
        path: "/register",
        name: "register",
        meta: { show: false },
        component: () => import("@/views/other/register.vue"),
    }
]

export default restRouter