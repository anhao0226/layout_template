
export function isArray(o: any): boolean {
    return Object.prototype.toString.call(o) === "[object Array]";
}

export function isObject(o: any): boolean {
    return Object.prototype.toString.call(o) === "[object Object]";
}