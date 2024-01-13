export namespace ApiUtils {

    const dev = process.env.NODE_ENV !== 'production'
    const serverUrl = dev ? 'http://localhost:3000' : 'https://api-simpleblog.kurtcan.com'

    export function getServerUrl(): string {
        return serverUrl;
    }

    export function getApiUrl(): string {
        return `${getServerUrl()}/api/v1`
    }

}