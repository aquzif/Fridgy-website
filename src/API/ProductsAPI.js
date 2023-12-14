import RequestUtils from "@/Utils/RequestUtils";

export default class ProductsAPI {
    static async getAll() {
        return await RequestUtils.apiGet('/api/product');
    }

    static async search(search) {
        return await RequestUtils.apiGet('/api/product/search?query=' + encodeURI(search));
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/product/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/product', data);

        if(result.status !== 201){
            throw new Error('ProductCategoriesAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/product/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/product/' + id);
    }

}