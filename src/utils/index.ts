import { utils, writeFile } from 'xlsx'
import router from "@/router";
import { useAppStore } from "@/store";
import dayjs from "dayjs";
import { stringify, parse } from "qs";

export const AMap = (window as any).AMap;
const typeMaps = new WeakMap();

/**
 * 
 * @param success 
 * @param failed 
 */
export function citySearch(success: (v: { province: string, city: string }) => void,
    failed?: (err: Error) => void) {
    AMap.plugin('AMap.CitySearch', () => {
        const citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status: string, result: any) {
            if (status === 'complete' && result.info === 'OK') {
                success({ province: result.province, city: result.city });
            } else {
                failed && failed(result);
            }
        })
    })
}

/**
 * 
 * @param cityname 
 * @param cb 
 */
export const cityWeather = (cityname: string, cb: (err: any, data: any) => void) => {
    AMap.plugin("AMap.Weather", () => {
        const weather = new AMap.Weather();
        weather.getLive(cityname, cb)
    });
};

/**
 * 
 * @param newValue 
 * @param oldValue 
 * @returns 
 */
export function different(newValue: any, oldValue: any): any {
    const diff: Record<string, string> = {}
    for (const key in newValue) {
        if (newValue[key] !== oldValue[key]) {
            diff[key] = newValue[key];
        }
    }
    return diff
}




export function reset() {
    //
}

interface Storage {
    getItem(key: string): any;
    setItem(key: string, val: any): void;
    removeItem(key: string): void;
    clear(): void;
}

class BaseStorage implements Storage {

    constructor(protected storage: Storage) { }
    getItem<T = any>(key: string): T | null {
        try {
            const value = JSON.parse(this.storage.getItem(key))
            return value
        } catch (err: any) {
            return null
        }
    }
    setItem(key: string, val: any): void {
        this.storage.setItem(key, JSON.stringify(val));
    }
    removeItem(key: string): void {
        return this.storage.removeItem(key);
    }
    clear(): void {
        this.storage.clear();
    }
}


class localStorage extends BaseStorage implements Storage {
    constructor(storage: Storage) {
        super(storage)
    }
}

export const storageLocal = new localStorage(window.localStorage)

export function isEmpty(): boolean {
    return false
}

export function isArray(o: any): boolean {
    return Object.prototype.toString.call(o) === "[object Array]";
}

export function isHomeRoute(path: string): boolean {
    return path === "/" || path === "/welcome";
}

export function isInvalidRoute(path: string): boolean {
    return ['/login', '/register', "/redirect"].includes(path);
}

export function hasOwn(o: any, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(o, key);
}

interface execlHeader {
    prop: string;
    label: string;
}
const { json_to_sheet } = utils
export function jsonToSheet(filename: string, header: execlHeader[], data: any[]) {
    const result: any[] = [];
    data.forEach(item => {
        const temp: any = {}
        header.forEach(h => {
            temp[h.label] = item[h.prop];
        })
        result.push(temp);
    })
    const ws = json_to_sheet(result)
    ws['!cols'] = [
        { wch: 10 },
        { wch: 30 },
        { wch: 25 }
    ]
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, filename)
    writeFile(wb, `${filename}.xlsx`)
}



// 格式化日期
export function formatDate(date: Date | string, template = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(date).locale("zh-cn").format(template);
}


// 定位
export function fetchCityPosition(cb: (state: boolean, province: string, city: string, err: Error) => void) {
    AMap.plugin('AMap.CitySearch', () => {
        const citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status: string, result: any) {
            if (status === 'complete' && result.info === 'OK') {
                cb(true, result.province, result.city, new Error())
            } else {
                cb(false, "", "", result)
            }
        })
    })
}

export function fetchDistrictSearch(level: string, name: string, cb: (success: boolean, list: any[]) => void) {
    AMap.plugin('AMap.DistrictSearch', () => {
        const districtSearch = new AMap.DistrictSearch({
            level,
            subdistrict: 1,
        })
        name = level === 'province' ? '中国' : name
        districtSearch.search(name, (status: string, result: any) => {
            if (status === 'complete' && result.info === 'OK') {
                cb(true, result.districtList[0].districtList);
            } else {
                cb(false, result);
            }
        })
    })

}

export function formatData(value: unknown): string {
    return stringify(value)
}

export function parseData(value: string): any {
    return parse(value)
}

export function valueToLabel(src: { label: string, value: string }[], value: string): any {
    if (!typeMaps.has(src)) {
        const temp: any = {};
        for (const item of src) temp[item.value] = item.label;
        typeMaps.set(src, temp);
    }
    return typeMaps.get(src)[value]
}

export function copy<T = any, U = any>(target: T, source: U) {
    for (const key in target) {
        if (hasOwn(source, key)) {
            target[key] = (source as any)[key]
        }
    }
}

export function getCanchValue(key: string): any {
    return window.localStorage.getItem(key);
}

export function isBeforeCurrDate(d1: Date | string): boolean {
    return dayjs(d1).isBefore(new Date());
}

export function encodeData(v: any): string {
    console.log((v as string).replaceAll("'", "'/"))
    return (v as string).replaceAll("'", "%%");
}

export function decodeData(v: any): string {
    return (v as string).replaceAll("%%", "'");
}


const empty = ['', null, void 0];
export function clearEmptyValue(params: any, skip?: string[]): any {
    const result: any = {}
    for (const key in params) {
        if (!empty.includes(params[key])) {
            result[key] = params[key];
        }
    }
    return result;
}

export function validationPhone(v: string): boolean {
    return /^[1][3,4,5,7,8,9][0-9]{9}$/.test(v)
}




