import RequestUtils from "@/Utils/RequestUtils";

export default class RecipeIngredientsAPI {
    static async getAll(recipeId) {
        return await RequestUtils.apiGet(`/api/recipe/${recipeId}/ingredient`);
    }


    static async get(recipeId,id) {
        return await RequestUtils.apiGet('/api/recipe/' + recipeId + '/ingredient/' + id);
    }

    static async create(recipeId,data) {
        const result = await RequestUtils.apiPost('/api/recipe/'+recipeId+'/ingredient', data);

        if(result.status !== 201){
            throw new Error('RecipeIngredientsAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(recipeId, id, data) {
        return await RequestUtils.apiPut('/api/recipe/' + recipeId + '/ingredient/'+id, data);
    }

    static async delete(recipeId,id) {
        return await RequestUtils.apiDelete('/api/recipe/' + recipeId+ '/ingredient/' + id);
    }

}