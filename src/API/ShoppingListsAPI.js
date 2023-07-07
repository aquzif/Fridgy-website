import RequestUtils from "@/Utils/RequestUtils";

export default class ShoppingListsAPI {

    static async getAll() {
        return await RequestUtils.apiGet('/api/shopping-list');
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/shopping-list/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/shopping-list', data);

        if(result.status !== 201){
            throw new Error('ShoppingListsAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/shopping-list/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/shopping-list/' + id);
    }

}
