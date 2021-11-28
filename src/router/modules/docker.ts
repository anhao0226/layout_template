import Layout from '@/layout/index.vue'

const dockerRouter = {
    path: "/util",
    name: "util",
    component: Layout,
    meta: { title: "message.admin", show: true, icon: "el-icon-user" },
    children: [
        {
            path: "docker",
            name: "docker",
            meta: { title: "message.docker", show: true, icon: "ri-window-fill                        " },
            component: () => import("@/views/other/docker.vue"),
        }
    ]
}



export default dockerRouter;