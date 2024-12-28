import RequestUtils from "@/Utils/RequestUtils";

export default class UserAPI {

    static getUser = async () => {
        return await RequestUtils.apiGet('/api/user');
    }

    static updateUser = async (data) => {
        return await RequestUtils.apiPut('/api/user', data);
    }

}