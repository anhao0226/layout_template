
import { RouteRecordRaw } from "vue-router";

import mapRouter from "./modules/map"
import homeRouter from './modules/home';
import restRouter from './modules/rest';
import userRouter from "./modules/user";
import commRouter from "./modules/comm"
import docerRouter from "./modules/docker"

const routerArray: Array<RouteRecordRaw> = [
    homeRouter,
    userRouter,
    commRouter,
    mapRouter,
    docerRouter,
];


/**
 * @param show
 * @param keepAlive
 * 
 */

const routes: any[] = [
    ...routerArray,
    ...restRouter,
]

export default routes;

