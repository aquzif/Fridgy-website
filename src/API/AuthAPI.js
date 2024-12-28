import RequestUtils from "@/Utils/RequestUtils";

export default class AuthAPI {


    static async login(email, password) {

        return await RequestUtils.post('/api/login', {
            email: email,
            password: password
        });
    }

    static async getUser() {
        return await RequestUtils.apiGet('/api/user');
    }

    static async logout() {

        return await RequestUtils.apiPost('/api/logout');

    }

}
