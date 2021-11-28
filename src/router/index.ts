import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
  useRoute
} from 'vue-router'
import routes from './routes'
import NProgress from "nprogress";
import { useAppStore } from '@/store';
import { hasOwn } from '@/utils';
import { cookieStore } from "@/utils/cache"

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const routerInit = () => {
  //
}

const routerSort = () => {
  //
}

export const routerFilter = (routes: RouteRecordRaw[]) => {
  const newTree = routes.filter((v: RouteRecordRaw) => v.meta!.show);
  newTree.forEach(v => v.children && (v.children = routerFilter(v.children)));
  return newTree;
}

const whitelist = ['/login', '/register'];

router.beforeEach((to: RouteLocationNormalized, from: any, next: any) => {
  if (!whitelist.includes(to.path)) {
    const appStore = useAppStore();
    if (to.meta.keepAlive) {
      const matched = to.matched;
      matched.forEach(item => {
        if (hasOwn(item.meta, "keepAlive")) {
          appStore.pageCacheOperate({ mode: "add", name: item.name! })
        }
      })
    }
    NProgress.start();
  }
  next();
})

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done();
})

export default router
