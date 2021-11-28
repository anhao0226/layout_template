import { axiosGet, axiosPost, axiosPut } from "@/utils/http";

export function dockerImages(
    param?: {
        args: number
    }
): Promise<any> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: "/docker/images",
            param,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}

export function dockerContainer(
    param?: {
        args: number
    }
): Promise<any> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: "/docker/containers",
            param,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}

export function dockerCommand(
    param?: {
        dockerID: number,
        command: string,
    }
): Promise<any> {
    return new Promise((resolve, reject) => {
        axiosPut({
            url: "/docker/kill",
            param,
            success: (res) => { resolve(res.data) },
            error: (err) => { reject(err) },
        })
    });
}