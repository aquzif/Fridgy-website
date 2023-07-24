import RequestUtils from "@/Utils/RequestUtils";

export default class GlobalUnitsAPI {

    static async getAll() {
        return await RequestUtils.apiGet('/api/global-unit');
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/global-unit/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/global-unit', data);

        if(result.status !== 201){
            throw new Error('GlobalUnitsAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/global-unit/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/global-unit/' + id);
    }

}
