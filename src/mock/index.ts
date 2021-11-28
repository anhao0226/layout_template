import axios from 'axios'
import Mock, { Random } from 'mockjs'
import NProgress from 'nprogress'


Mock.Random.extend({
    mobile: function () {
        const prefixs = ["132", "135", "189"];
        return this.pick(prefixs) + Mock.mock(/\d{8}/);
    }
})

Mock.mock('/user/record', 'get', (options: any) => {
    const body = JSON.parse(options.body);
    const pageNo = body.pageNo || 1;
    const pageSize = body.pageSize || 30;
    const temp = function () {
        return {
            id: Random.increment(),
            mobile: Random.mobile(),
            nickname: Random.cname(),
            gender: Random.integer(0, 2),
            email: Random.email(),
            province: Random.province(),
            city: Random.city(),
            birthday: Random.datetime(),
        }
    }

    const data: any[] = [];

    for (let i = 0; i < pageSize; i++) {
        data.push(temp())
    }

    return { code: "0000", success: true, message: "ok", data }
})

Mock.mock('/user/record', 'get');


export function fetchUserInfo(): Promise<any> {
    return axios.get("/user/record");
}


export function fetchUserRecord(data: any): Promise<any> {
    return axios.get("/user/record", { data });
}



import { formatData, hasOwn, parseData } from '@/utils';

// Mock.mock('/notice/report', 'get', [


//     {
//         id: Random.increment(),
//         uuid: Random.guid(),
//         reason: Random.csentence(),
//         details: Random.csentence(),
//         company: Random.guid(),
//         mobile: Random.email(),
//         created_at: Random.datetime(),
//         updated_at: Random.datetime(),
//         state: Random.boolean(),
//     },

// ])

const template__001 = function () {
    return {
        id: Random.increment(),
        uuid: Random.guid(),
        reason: Random.csentence(),
        details: Random.csentence(),
        company: Random.csentence(),
        mobile: Random.email(),
        created_at: Random.datetime(),
        updated_at: Random.datetime(),
        state: Random.boolean(),
        type: Random.range(0, 3),
        result: Random.csentence(),
    }
}

const template__002 = function () {
    return {
        id: Random.increment(),
        uuid: Random.guid(),
        contacts: Random.name(),
        mobile: Random.email(),
        demand: Random.csentence(),
        created_at: Random.datetime(),
        state: Random.boolean(),
    }
}


type Template = () => void

const generateTemplate = (params: any = {}, count: number, template: Template) => {
    const list = new Array(count);
    for (let i = 0; i < count; i++) {
        list[i] = template();
        for (const key in params) (list[i] as any)[key] = params[key];
    }
    return list
}



Mock.mock('/notice/report', 'get', (options: any) => {
    const query = parseData(options.body);
    if (query.state === 0) {
        return generateTemplate({ state: 0 }, 30, template__001);
    } else {
        return generateTemplate({ state: 1 }, 30, template__001);
    }

})


Mock.mock('/notice/report', 'get', (options: any) => {
    const query = parseData(options.body);
    if (query.state === 0) {
        return generateTemplate({ state: 0 }, 30, template__001);
    } else {
        return generateTemplate({ state: 1 }, 30, template__001);
    }

})


Mock.mock('/company/companyName', 'get');
Mock.mock('/company/staffName', 'get');

interface Response {
    code: string
    success: boolean
    data: any
    message: string
}

export function fetchReportNotice(params: {
    state: number,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axios({
            url: "/notice/report",
            method: 'GET',
            data: formatData(params),
        }).then(res => {
            console.log(res);
            resolve({ code: "0000", success: true, data: res.data, message: "" });
        })
    })
}

export function fetchSubscribe(params: {
    state: number,
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axios({
            url: "/admin/subscribe",
            method: 'GET',
            data: formatData(params),
        }).then(res => {
            console.log(res);
            resolve({ code: "0000", success: true, data: res.data, message: "" });
        })
    })
}

export function fetchCompanyName(param: {
    company?: string
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axios({
            url: "/company/companyName",
            method: 'GET',
            data: formatData(param),
        }).then(res => {
            const company = {
                'd836fabd-157c-11ec-a087-0242ac110002': "武汉企小二科技有限公司",
            }
            resolve({ code: "0000", success: true, data: company, message: "" });
        })
    })
}

export function fetchStaffName(param: {
    company?: string
}): Promise<Response> {
    return new Promise((resolve, reject) => {
        axios({
            url: "/company/staffName",
            method: 'GET',
            data: formatData(param),
        }).then(res => {
            const company = {
                'd836fabd-157c-11ec-a087-0242ac110002': "企小二"
            }
            resolve({ code: "0000", success: true, data: company, message: "" });
        })
    })
}
