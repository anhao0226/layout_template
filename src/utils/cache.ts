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

class CookieStorage implements IStorage {

    /**
     * 
     * @param value 
     * @returns 
     */
    read(value: string): string {
        if (value[0] === '"') {
            value = value.slice(1, -1)
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    }

    /**
     * 
     * @param value 
     * @returns 
     */
    write(value: string) {
        return encodeURIComponent(value).replace(
            /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
            decodeURIComponent
        )
    }

    /**
     * 
     * @param name 
     * @returns 
     */
    getItem(name: string) {
        if (typeof document === void 0 || (arguments.length && !name)) return;
        console.log(document.cookie);
        const cookies = document.cookie ? document.cookie.split(";") : [];
        console.log(cookies);
        const jar: Record<string, any> = {};
        for (const v of cookies) {
            const parts = v.split("=");
            const value = parts.slice(1).join("=");
            const found = decodeURIComponent(parts[0]);
            jar[found] = this.read(value)
            if (name === found) {
                break
            }
        }
        console.log(jar);
        return name ? jar[name] : jar
    }

    /**
     * 
     * @param name 
     * @param value 
     * @param attributes 
     * @returns 
     */
    setItem(name: string, value: any, attributes: Record<string, any>): void {
        if (typeof document === void 0) return;
        name = encodeURIComponent(name)
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
            .replace(/[()]/g, escape);
        let stringifiedAttributes = ''
        for (const attributeName in attributes) {
            if (!attributes[attributeName]) continue;
            stringifiedAttributes += '; ' + attributeName
            if (attributes[attributeName] === true) continue;
            stringifiedAttributes += '=' + (attributes as any)[attributeName].split(';')[0]
        }
        document.cookie =
            name + '=' + this.write(value) + stringifiedAttributes;
    }
    /**
     * 
     * @param key 
     */
    removeItem(key: string): void {
        this.setItem(key, '', { expires: -1 })
    }
    clear(): void {
        throw new Error("Method not implemented.");
    }

}

export const cookieStore = new StorageProxy(new CookieStorage());



