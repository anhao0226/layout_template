import Layout from '@/layout/index.vue'

const userRouter = {
    path: "/user",
    name: "user",
    component: Layout,
    meta: { title: "message.userManage", show: true, keepAlive: false, icon: "el-icon-user" },
    children: [
        {
            path: "info",
            name: "user-info",
            meta: { title: "message.userinfo", show: true, keepAlive: false },
            component: () => import("@/views/user/details.vue"),
        },
        {
            path: "record",
            name: "user-record",
            meta: { title: "message.statistics", show: true, keepAlive: false },
            component: () => import("@/views/user/record.vue"),
        }
    ]
}

export default userRouter;