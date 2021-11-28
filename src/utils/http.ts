import axios, { AxiosResponse } from "axios";
import NProgress from "nprogress"
import Axios from 'axios'
import { clearEmptyValue, formatData, getCanchValue, hasOwn } from '.';
import { ElMessageBox } from 'element-plus'
import router from "@/router";

type Callback<T = any> = (data: T) => void;

export interface Response {
    code: string
    success: boolean
    data: any
    message: string
    count: number
}


interface requestConfig {
    url: string;
    method: string;
}

/**
 * docker run --name qixiaoer_web -v /root/web_server/qixiaoer_site/nginx/nginx.conf:/etc/nginx/nginx.conf --network my-bridge -p 8080:8080 -d nginx
 */
const instance = Axios.create({
    // baseURL: 'http://123.57.239.39/api/v1',
    baseURL: 'http://localhost:8088',
    timeout: 50000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export interface Option {
    url: string
    data?: any
    param?: any
    success: (res: AxiosResponse<Response>) => void,
    error: (err: Error) => void,
}

const whiteList: string[] = ["/login"];

instance.interceptors.request.use((request) => {
    if (!whiteList.includes(request.url!)) {
        if (hasOwn(request, "params")) {
            request.params = clearEmptyValue(request.params);
        }
    }
    return request;
})


instance.interceptors.response.use((response: any) => {
    if (typeof response.data !== 'object') {
        ElMessageBox({ type: "error", message: "服务端异常!" })
        return Promise.reject(response);
    }
    if (!response.data.success) {
        switch (response.data.code) {
            case "1005":
                router.push("/login");
                break
            default:
                ElMessageBox({ type: "error", message: response.data?.message })
        }
        return Promise.reject(response)
    }
    return response
}, (err: Error) => {
    if (err.message === "Network Error") {
        ElMessageBox({
            type: "error",
            message: "网络错误",
        })
    }
    return Promise.reject(err)
})



export function axiosGet(option: Option) {
    instance({
        url: option.url,
        method: 'GET',
        params: option.param
    }).then(res => {
        option.success(res.data as any)
    }).catch((err: Error) => {
        option.error(err)
    })
}

export function axiosPut(option: Option) {
    instance({
        url: option.url,
        method: 'PUT',
        params: option.param
    }).then(res => {
        option.success(res.data as any)
    }).catch((err: Error) => {
        option.error(err)
    })

}

export function axiosPost(option: Option) {
    instance({
        url: option.url,
        method: 'POST',
        data: formatData(option.data),
    }).then(res => {
        option.success(res.data as any);
    }).catch((err: Error) => {
        option.error(err)
    })

}

// host port
// 执行文件目录


/**
 *
 * docker
 * -- /usr/share/nginx/html
 * -- /var/log/nginx/
 *
 * docker run --name layout_template -d -p 8080:8080 -v /root/docker/layout_template/nginx/log:/var/log/nginx -v /root/docker/layout_template/nginx/conf:/etc/nginx/conf.d
 *
 *
 * docker run --name test-01 -it -p 8080:8080 -v /root/docker/layout_template/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /root/docker/layout_template/nginx/conf.d:/etc/nginx/conf.d -v /root/docker/layout_template/nginx/html:/usr/share/nginx/html -v /root/docker/layout_template/nginx/logs:/var/log/nginx -d nginx
 *
 * docker run --name layout_template -it -p 8080:8080 --network my-bridge
 * -v /data/nginx/conf/nginx.conf:/etc/nginx/nginx.conf:ro
 * -v /data/nginx/conf.d:/etc/nginx/conf.d:ro
 * -v /data/nginx/html:/usr/share/nginx/html:rw
 * -v/data/nginx/logs:/var/log/nginx -d nginx
 */