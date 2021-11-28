import { axiosGet, axiosPost, axiosPut, Response } from "../utils/http"


export function publishNotice(param: {
    title: string,
    content: string,
    type: string,
    province: string,
    city: string,
    contacts: string,
    telephone: string,
    industry: string,
    deadline: string,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPost({
            url: '/notice/publish',
            data: param,
            success: (data) => resolve(data as any),
            error: (err) => reject(err)
        })
    })
}

export function editNotice(param: {
    id?: number,
    uuid?: string,
    state?: number,
    violations?: number,
    review?: number,
    handler_result?: number,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPut({
            url: '/notice/edit',
            param: param,
            success: (data) => resolve(data as any),
            error: (err) => reject(err)
        })
    })
}

export function editNoticeRecord(param: {
    id?: number,
    uuid: string,
    state?: number,
    violations?: number,
    review?: number,
    handle_result?: number,
    reason?: string
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPut({
            url: '/notice/edit',
            param: param,
            success: (data) => resolve(data as any),
            error: (err) => reject(err)
        })
    })
}

export function fetchNoticeList(param: {
    uuid?: string,
    city?: string,
    company?: string,
    staff?: string,
    state?: number,
    industry?: string,
    type?: number,
    province?: string,
    reported?: number,
    review?: string,
    count?: string,
    title?: string,
    contacts?: string,
    search?: string,
    startDate?: string,
    endDate?: string,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: '/notice',
            param: param,
            success: (res) => { resolve(res as any) },
            error: (err) => { reject(err) }
        })
    })
}

export function searchList(param: { company: string }): Promise<any> {
    return new Promise(() => {
        //
    })
}

export function fetchReportNotice(param: {
    uid?: string,
    state?: number,
    reported?: number
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: '/notice/report',
            param: param,
            success: (res) => { resolve(res as any) },
            error: (err) => { reject(err) }
        })
    })
}

export function fetchReportedNotice(param: {
    uuid?: string,
    state?: number,
    report?: string,
    count?: string,
    search?: string,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: '/notice/reported',
            param: param,
            success: (res) => { resolve(res as any) },
            error: (err) => { reject(err) }
        })
    })
}

export function fetchReportedCompany(params: {
    company: string
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosGet({
            url: "/notice/reported/company",
            param: params,
            success: (res) => { resolve(res as any) },
            error: (err) => { reject(err) }
        })
    })
}

export function handleReport(param: {
    uid?: string,
    expired?: string | unknown,
    review: number,
    notice?: string,
    violations: string,
    handle_result: string,
    reason?: number,
    report?: string,
    company?: string,
    state?:string,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPut({
            url: "/notice/report/manage",
            param,
            success: (data) => { resolve(data as any) },
            error: (err) => { reject(err) }
        })
    })
}

export function addReportRecord(data: {
    type?: number
    state?: number,
    staff?: string,
    company?: string,
    report?: string,
    details?: string,
    reason?: string,
    result?: number,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axiosPost({
            url: "/notice/report",
            data: data,
            success: (res) => { resolve(res as any) },
            error: (err) => { reject(err) }
        })
    })
}


export default async function (params: any) {
    //
}