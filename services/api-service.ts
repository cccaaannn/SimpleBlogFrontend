import { LocalStorageKeys } from "../types/enums/local-storage-keys";
import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils";
import { Storage } from "../utils/storage";


export class ApiService {
    
    static tokenExpiredInterceptor() {
        if(AuthUtils.isLoggedIn() && AuthUtils.isExpired()) {
            AuthUtils.logout();
            window.location = "/home" as any;
            return true;
        }
        return false;
    }

    static getFetchOptions(options: any) {
        const update = { ...options };
        
        update.headers = {
            "Content-Type": 'application/json; charset=utf-8'
        }
        
        if (AuthUtils.isLoggedIn()) {
            const token = Storage.get(LocalStorageKeys.TOKEN) || "";
            update.headers.Authorization = `Bearer ${token}`;
        }
        
        return update;
    }
    
    static async fetcher(url: string, options: any) {
        // Intercept on token expiration
        const isExpired = ApiService.tokenExpiredInterceptor();
        if(isExpired) {
            return new Response();
        }

        url = `${ApiUtils.getApiUrl()}${url}`
        options = ApiService.getFetchOptions(options);

        return await fetch(url, options);
    }

}

