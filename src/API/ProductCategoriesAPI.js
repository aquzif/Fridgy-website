import RequestUtils from "@/Utils/RequestUtils";

export default class ProductCategoriesAPI{
    static async getAll() {
        return await RequestUtils.apiGet('/api/product-category');
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/product-category/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/product-category', data);

        if(result.status !== 201){
            throw new Error('ProductCategoriesAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/product-category/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/product-category/' + id);
    }
}
