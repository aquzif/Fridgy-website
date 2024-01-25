import RequestUtils from "@/Utils/RequestUtils";

export default class RecipesAPI {
    static async getAll(page = 1) {
        return await RequestUtils.apiGet(`/api/recipe`);
    }

    static async search(search) {
        return await RequestUtils.apiGet('/api/product/search?query=' + encodeURI(search));
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/recipe/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/recipe', data);

        if(result.status !== 201){
            throw new Error('RecipesAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/recipe/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/recipe/' + id);
    }

}