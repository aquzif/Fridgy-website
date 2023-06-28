
export default class NetworkUtils {

    static isOnline() {
        return window.navigator.onLine;
    }
    static isLocalhost() {
        return window.location.hostname === "localhost";
    }
}