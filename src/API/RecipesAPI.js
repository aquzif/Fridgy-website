import RequestUtils from "@/Utils/RequestUtils";

export default class RecipesAPI {
    static async getAll(page = 1,selectedTags,needAllTags) {
        console.log('REQUESTING PAGE: ' + page);
        return await RequestUtils.apiGet(`/api/recipe?page=${page}&selectedTags=${JSON.stringify(selectedTags)}&needAllTags=${needAllTags}`,);
    }

    static async random() {
        return await RequestUtils.apiGet('/api/recipe/random');
    }
    static async search(search,page,selectedTags,needAllTags) {
        return await RequestUtils.apiGet(`/api/recipe/search?page=${page}&selectedTags=${JSON.stringify(selectedTags)}&needAllTags=${needAllTags}&query=` + encodeURI(search));
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