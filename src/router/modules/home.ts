import Layout from '@/layout/index.vue'

const homeRouter = {
    path: "/",
    name: "home",
    component: Layout,
    redirect: { name: "welcome" },
    meta: { title: "message.home", show: true, rank: 0, icon: "el-icon-house", keepAlive: false },
    children: [
        {
            path: "/welcome",
            name: "welcome",
            meta: { title: "message.home", show: true, icon: "el-icon-house", keepAlive: false },
            component: () => import("@/views/home.vue"),
        }
    ]
}



export default homeRouter;