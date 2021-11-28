import { axiosGet, axiosPost, axiosPut, Response } from "@/utils/http";


export function userRegister(
    data: {
        email: string,
        password: string,
    }
): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPost({
            url: "/user/register",
            data,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}

export function userLogin(
    data: {
        email: string,
        password: string,
    }
): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPost({
            url: "/user/login",
            data,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}

export function userInfo(
    param?: {
        user?: string,
    }
): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: "/user/info",
            param,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}

export function userInfoEdit(
    param: {
        age: string,
        nickname: string,
        gender: string,
        birthday: string,
    }
): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPut({
            url: "/user/info/edit",
            param,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}

export function userRecords(
    param?: {
        age: number
    }
): Promise<any> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: "/user/records",
            param,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}
