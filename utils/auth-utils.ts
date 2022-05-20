import { LocalStorageKeys } from "../types/enums/local-storage-keys";
import { Storage } from "./storage";
import jwt from 'jsonwebtoken';
import { TokenPayload } from "../types/TokenPayload";

export namespace AuthUtils {

    export function isLoggedIn(): boolean {
        return Storage.get(LocalStorageKeys.TOKEN) != null ? true: false;
    }

    export function getTokenPayload(): TokenPayload {
        const token = Storage.get(LocalStorageKeys.TOKEN);
        const tokenPayload: any = jwt.decode(token);
        return tokenPayload.tokenPayload as TokenPayload;
    }

    export function logout(): void {
        Storage.clear(LocalStorageKeys.TOKEN);
    }

    export function isExpired() {
        const token = Storage.get(LocalStorageKeys.TOKEN);
        const tokenPayload: any = jwt.decode(token);
        if(tokenPayload.exp > +new Date) {
            return true;
        }
        return false;
    }

}