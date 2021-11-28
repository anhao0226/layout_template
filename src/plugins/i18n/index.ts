

const zh = {
    charts: "统计"
}

const en = {
    charts: "Charts"
}


const defaultMessage = {
    zh: { message: zh },
    en: { message: en }

}

const baseMessage = {
    zh: {
        "home": "首页",
        "component": "组件",
        "table": "表格组件",
        "config": "配置",
        "admin": "平台管理",
        "user": "用户",
        "company": "公司",
        "reload": "重新加载",
        "info": "信息",
        "closeCurrentTab": "关闭当前标签页",
        "closeLeftTabs": "关闭左侧标签页",
        "closeRightTabs": "关闭右侧标签页",
        "userManage": "用户管理",
        "userinfo": "用户信息",
        "userRecord": "用户记录",
        "notice": "榜文管理",
        "notice-pedding": "待处理榜文",
        "notice-reviewed": "已处理榜文",
        "notice-publish": "发布榜文",
        "closeAllTags": "关闭所有标签页",
        "closeOtherTags": "关闭其他标签页",
        "docker": "容器管理",
        "statistics": "统计信息",
        "login": "登录",
        "register": "注册",
        "username": "用户名",
        "password": "密码",
        "map": "地图组件",
    },
    en: {
        "home": "Home",
        "component": "Component",
        "table": "Table",
        "config": "Config",
        "admin": "Admin Manage",
        "user": "User",
        "company": "Company",
        "reload": "Reload",
        "info": "Info",
        "closeCurrentTab": "Close Current Tab",
        "closeLeftTabs": "Close Left Tabs",
        "closeRightTabs": "Close Right Tabs",
        "userManage": "User Manage",
        "userinfo": "Info",
        "userRecord": "Record",
        "notice": "Notice",
        "notice-pedding": "Notice pedding",
        "notice-reviewed": "Notice reviewed",
        "notice-publish": "Notice publish",
        "closeAllTags": "Close all tags",
        "closeOtherTags": "Close other tags",
        "docker": "Docker",
        "statistics": "Statistics",
        "login": "Login",
        "register": "Register",
        "username": "Username",
        "password": "Password",
    }
}

const toolbarMessage = {
    zh: {
        add: "添加",
        delete: "删除",
        upload: "导入",
        download: "导出",
        refresh: "刷新",
        settings: "设置",
        field: "字段"
    },
    en: {
        add: "Add",
        delete: "Delete",
        upload: "Upload",
        download: "Ddownload",
        refresh: "Refresh",
        settings: "Settings",
        field: "Fields",
    }
}


export const userHeader = {
    zh: {
        mobile: "手机号",
        nickname: "昵称",
        gender: "性别",
        email: "邮箱",
        province: "省份",
        city: "城市",
        birthday: "生日",
    },
    en: {
        mobile: "Mobile",
        nickname: "Nickname",
        gender: "Gender",
        email: "Email",
        province: "Province",
        city: "City",
        birthday: "Birthday",
    }
}


import { createI18n } from 'vue-i18n';
import inputMessage from './input.message';

const messages = [baseMessage, toolbarMessage, userHeader, inputMessage];

const buildMessage = () => {
    messages.forEach(item => {
        defaultMessage.en.message = {
            ...defaultMessage.en.message,
            ...item.en,
        }
        defaultMessage.zh.message = {
            ...defaultMessage.zh.message,
            ...item.zh,
        }
    })
}

buildMessage();

console.log(defaultMessage);

export const i18n = createI18n({
    locale: "zh",
    fallbackLocale: "en",
    globalInjection: true,
    legacy: false,
    messages: defaultMessage,
})

export default i18n
