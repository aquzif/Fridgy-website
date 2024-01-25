
export default class NetworkUtils {

    static isOnline() {
        return window.navigator.onLine;
    }
    static isLocalhost() {
        return window.location.hostname === "localhost";
    }

    static fixBackendUrl(url) {
        if(!url) return url;
        if (url[0] === '/' && NetworkUtils.isLocalhost()) {
            url = 'http://localhost:8000' + url;
        }
        return url;
    }
}