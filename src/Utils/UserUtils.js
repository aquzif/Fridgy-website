import store from "@/Store/store";

export default class UserUtils {

    static getUserToken() {
        return store.getState().authReducer.token;
    }

}
