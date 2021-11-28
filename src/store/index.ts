
import router from '@/router';
import { storageLocal } from '@/utils';
import { createPinia, defineStore } from 'pinia'
import { App } from 'vue'
import { RouteRecordName, RouteRecordRaw } from 'vue-router';
import { routerFilter } from '@/router'
import routes from "@/router/routes"


interface pageCacheType {
    mode: "add" | "remove",
    name: RouteRecordName
}


function initLocalStore() {
    const menuState = storageLocal.getItem("_Menu_State") || false;
    return {
        menuState
    }
}

export const useAppStore = defineStore("app-store", {
    state: () => {
        return {
            avatar: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqqpublic.qpic.cn%2Fqq_public%2F0%2F0-4018497981-AC5EA2CE44492FFB6870CB7EEA8968FA%2F0%3Ffmt%3Djpg%26size%3D244%26h%3D900%26w%3D900%26ppv%3D1.jpg&refer=http%3A%2F%2Fqqpublic.qpic.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638797302&t=e3a957e036be792f69f51eb492935542https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqqpublic.qpic.cn%2Fqq_public%2F0%2F0-4018497981-AC5EA2CE44492FFB6870CB7EEA8968FA%2F0%3Ffmt%3Djpg%26size%3D244%26h%3D900%26w%3D900%26ppv%3D1.jpg&refer=http%3A%2F%2Fqqpublic.qpic.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638797302&t=e3a957e036be792f69f51eb492935542https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqqpublic.qpic.cn%2Fqq_public%2F0%2F0-4018497981-AC5EA2CE44492FFB6870CB7EEA8968FA%2F0%3Ffmt%3Djpg%26size%3D244%26h%3D900%26w%3D900%26ppv%3D1.jpg&refer=http%3A%2F%2Fqqpublic.qpic.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638797302&t=e3a957e036be792f69f51eb492935542",
            menuState: false,
            routes: new Array<RouteRecordRaw>(), // 
            currentMenu: "/welcome",
            pageCacheList: new Array<string>(),
            colorStyle: false,
            isFullScreen: false,
            userinfo: {
                admin: false,
            },
        }
    },
    actions: {

        /**
         * @method loadRoute
         */
        initRouter() {
            this.routes = routerFilter(routes)
            console.log(this.routes);
        },

        /**
         * @method fullScreen
         */
        fullScreen() {
            this.isFullScreen = !this.isFullScreen;
        },

        /**
         * @method menuOpen
         */
        menuOpen() {
            this.menuState = !this.menuState;
            storageLocal.setItem("_Menu_State", this.menuState);
        },

        /**
         * @method colorStyleToggle
         */
        colorStyleToggle() {
            this.colorStyle = !this.colorStyle;
        },


        /**
         * @method menuToggle
         * @param path string
         */
        menuToggle(path: string) {
            this.currentMenu = path;
            router.push({ path });
        },

        /**
         * @method pageCacheOperate
         * @param {}
         */
        pageCacheOperate({ mode, name }: pageCacheType) {
            switch (mode) {
                case "add":
                    this.pageCacheList.push(name.toString());
                    this.pageCacheList = [...new Set(this.pageCacheList)];
                    break;
                case "remove":
                    {
                        const index = this.pageCacheList.indexOf(name.toString());
                        if (index !== -1) {
                            this.pageCacheList.splice(index, 1);
                        }
                    }
                    break;
            }
        }
    }
})

const store = createPinia();

export function setupStore(app: App<Element>) {
    app.use(store);
}

store.use(initLocalStore);