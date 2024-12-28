import RequestUtils from "@/Utils/RequestUtils";


export default class FastFoodStoresAPI {

    static async getAll(page = 1) {
        return await RequestUtils.apiGet(`/api/fast-food-store`);
    }

    static async search(search) {
        return await RequestUtils.apiGet('/api/fast-food-store/search?query=' + encodeURI(search));
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/fast-food-store/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/fast-food-store', data);

        if(result.status > 300){
            throw new Error('FastFoodStoresAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/fast-food-store/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/fast-food-store/' + id);
    }

}