import RequestUtils from "@/Utils/RequestUtils";

export default class RecipeTagsAPI {

    static async getAll() {
        return await RequestUtils.apiGet('/api/recipe-tag');
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/recipe-tag/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/recipe-tag', data);

        if(result.status !== 201){
            throw new Error('RecipeTagsAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/recipe-tag/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/recipe-tag/' + id);
    }

}
