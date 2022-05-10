import { LocalStorageKeys } from "../types/enums/local-storage-keys";

export namespace Storage {

    export function set(key: LocalStorageKeys, value: string): any {
        localStorage.setItem(key, value);
    }

    export function setJson(key: LocalStorageKeys, values: object): any {
        localStorage.setItem(key, JSON.stringify(values));
    }

    export function get(key: LocalStorageKeys): any {
        return localStorage.getItem(key);
    }

    export function getJson(key: LocalStorageKeys): any {
        const item: any = localStorage.getItem(key);
        return item != null ? JSON.parse(item) : null;
    }

    export function clear(key: LocalStorageKeys): void {
        localStorage.removeItem(key);
    }

}