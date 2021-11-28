interface IStorage {
    getItem(key: string): any;
    setItem(key: string, val: any, attributes?: Record<string, any>): void;
    removeItem(key: string): void;
    clear(): void;
}

class StorageProxy implements IStorage {
    constructor(protected storage: IStorage) { }
    getItem<T = any>(key: string): T | null {
        try {
            const value = JSON.parse(this.storage.getItem(key) as string)
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


class LocalStorage extends StorageProxy implements IStorage {
    constructor(storage: Storage) {
        super(storage)
    }
}

class CookieStorage implements IStorage {

    read(value: string): string {
        if (value[0] === '"') {
            value = value.slice(1, -1)
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    }

    write(value: string) {
        return encodeURIComponent(value).replace(
            /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
            decodeURIComponent
        )
    }

    getItem(name: string) {
        if (typeof document === void 0 || (arguments.length && !name)) return;
        const cookies = document.cookie ? document.cookie.split(";") : [];
        let jar: Record<string, any> = {};
        for (let v of cookies) {
            let parts = v.split("=");
            let value = parts.slice(1).join("=");
            try {
                let found = decodeURIComponent(parts[0]);
                jar[found] = this.read(value)
                if (name === found) {
                    break
                }

            } catch (e) { }
        }
        return name ? jar[name] : jar
    }

    setItem(name: string, value: any, attributes: Record<string, any>): void {
        if (typeof document === void 0) return;
        name = encodeURIComponent(name)
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
            .replace(/[()]/g, escape);
        let stringifiedAttributes = ''
        for (let attributeName in attributes) {
            if (!attributes[attributeName]) continue;
            stringifiedAttributes += '; ' + attributeName
            if (attributes[attributeName] === true) continue;
            stringifiedAttributes += '=' + (attributes as any)[attributeName].split(';')[0]
        }
        document.cookie =
            name + '=' + this.write(value) + stringifiedAttributes;
    }

    removeItem(key: string): void {
        this.setItem(key, '', { expires: -1 })
    }

    clear(): void {
        throw new Error("Method not implemented.");
    }

}


const cookieStorage = new StorageProxy(new CookieStorage())




