import jwt from 'jsonwebtoken';

import { LocalStorageKeys } from "../types/enums/local-storage-keys";
import { TokenPayload } from "../types/TokenPayload";
import { Roles } from "../types/enums/Roles";
import { Storage } from "./storage";


export namespace AuthUtils {

    export function isLoggedIn(): boolean {
        return Storage.get(LocalStorageKeys.TOKEN) != null ? true : false;
    }

    export function isAdmin(): boolean {
        const token = Storage.get(LocalStorageKeys.TOKEN);
        if(token == null) {
            return false;
        }
        const tokenPayload: any = jwt.decode(token);
        return tokenPayload.tokenPayload.role == Roles.ADMIN ? true : false;
    }

    export function isRole(role: Roles): boolean {
        const token = Storage.get(LocalStorageKeys.TOKEN);
        if(token == null) {
            return false;
        }
        const tokenPayload: any = jwt.decode(token);
        return tokenPayload.tokenPayload.role == role ? true : false;
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

        if ((tokenPayload.exp * 1000) < +new Date) {
            return true;
        }
        return false;
    }

}