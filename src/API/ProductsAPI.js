import RequestUtils from "@/Utils/RequestUtils";

export default class ProductsAPI {
    static async getAll(page = 1) {
        return await RequestUtils.apiGet(`/api/product`);
    }

    static async getNutrition(name) {
        const result = await RequestUtils.apiGet(`/api/ai/nutrition?product=${name}`);

        if(result.status >= 300){
            throw new Error('ProductsAPI.getNutrition() failed, status: ' + result.status);
        }

        if(result.data.status !== 'FOUND'){
            throw new Error('ProductsAPI.getNutrition() failed, status: ' + result.data.status);
        }

        return result.data;
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
            throw new Error('ProductsAPI.create() failed, status: ' + result.status);
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