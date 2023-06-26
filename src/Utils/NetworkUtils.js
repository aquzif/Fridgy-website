
export default class NetworkUtils {
    static isLocalhost() {
        console.log(window.location.hostname);
        return window.location.hostname === "localhost";
    }
}