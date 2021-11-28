import Layout from '@/layout/index.vue'

const homeRouter = {
    path: "/",
    name: "comm",
    component: Layout,
    redirect: { name: "welcome" },
    meta: { title: "message.home", show: true, rank: 0, icon: "el-icon-house", keepAlive: false },
    children: [
        {
            path: "/table",
            name: "table",
            meta: { title: "message.table", show: true, icon: "ri-table-fill", keepAlive: false },
            component: () => import("@/views/table/index.vue"),
        }
    ]
}



export default homeRouter;