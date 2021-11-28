
import dayjs from "dayjs";

export const timeTemp = "HH:mm:ss";
export const dateTemp = "YYYY-MM-DD";

export function dateFormat(date: Date | string, template = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(date).locale("zh-cn").format(template);
}

export function isBefore() {
    //
}

export function isAfter() {
    //
}