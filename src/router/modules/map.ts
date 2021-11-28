import Layout from '@/layout/index.vue'

const mapRouter = {
    path: "/map",
    name: "map",
    component: Layout,
    meta: { title: "message.home", show: true, rank: 0, icon: "el-icon-house", keepAlive: false },
    children: [
        {
            path: "/map",
            name: "map",
            meta: { title: "message.map", show: true, icon: "ri-road-map-line", keepAlive: false },
            component: () => import("@/views/other/map.vue"),
        }
    ]
}



export default mapRouter;