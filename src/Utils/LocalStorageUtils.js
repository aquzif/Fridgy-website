import store from "@/Store/store";


export default class LocalStorageUtils {

    static saveState() {
        const state = store.getState();
        LocalStorageUtils.saveAuthReducerState(state.authReducer);
    }

    static getData(key = 'auth') {
        return localStorage.getItem(key)
            ? JSON.parse(localStorage.getItem(key)) : {};
    }

    static saveAuthReducerState(state) {
        localStorage.setItem('auth', JSON.stringify(state));
    }


}
