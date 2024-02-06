import RequestUtils from "@/Utils/RequestUtils";


export default class ShoppingListEntriesAPI {

    static async getAll(shoppingListId) {
        return await RequestUtils.apiGet('/api/shopping-list/' + shoppingListId + '/entry');
    }

    static async get(shoppingListId, id) {
        return await RequestUtils.apiGet('/api/shopping-list/' + shoppingListId + '/entry/' + id);
    }

    static async create(shoppingListId, data) {
        return await RequestUtils.apiPost('/api/shopping-list/' + shoppingListId + '/entry', data);
    }

    static async update(shoppingListId, id, data) {
        return await RequestUtils.apiPut('/api/shopping-list/' + shoppingListId + '/entry/' + id, data);
    }

    static async delete(shoppingListId, id) {
        return await RequestUtils.apiDelete('/api/shopping-list/' + shoppingListId + '/entry/' + id);
    }

    static async check(shoppingListId, id,newStatus) {
        return await RequestUtils.apiPut('/api/shopping-list/' + shoppingListId + '/entry/' + id + '/check',{
            checked: newStatus ? '1' : '0'
        });
    }

}
