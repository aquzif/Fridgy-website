import RequestUtils from "@/Utils/RequestUtils";

export default class ShoppingListsAPI {

    static async getAll() {
        return await RequestUtils.apiGet('/api/shopping-list');
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/shopping-list/' + id);
    }

    static async create(data) {
        return await RequestUtils.apiPost('/api/shopping-list', data);
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/shopping-list/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/shopping-list/' + id);
    }

}
