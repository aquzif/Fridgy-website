import RequestUtils from "@/Utils/RequestUtils";


export default class FastFoodStoreMealSetMealsAPI {

    static async getAll(fastFoodStoreId, fastFoodMealSetId,page = 1) {
        return await RequestUtils.apiGet(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${fastFoodMealSetId}/meal`);
    }

    static async search(fastFoodStoreId, fastFoodMealSetId,search) {
        return await RequestUtils.apiGet(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${fastFoodMealSetId}/meal/search?query=${encodeURI(search)}`);
    }

    static async get(fastFoodStoreId, fastFoodMealSetId,id) {
        return await RequestUtils.apiGet(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${fastFoodMealSetId}/meal/${id}`);
    }

    static async create(fastFoodStoreId, fastFoodMealSetId,data) {
        const result = await RequestUtils.apiPost(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${fastFoodMealSetId}/meal`, data);

        if(result.status > 300){
            throw new Error('FastFoodStoreMealsAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(fastFoodStoreId, fastFoodMealSetId, id, data) {
        return await RequestUtils.apiPut(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${fastFoodMealSetId}/meal/${id}`, data);
    }

    static async delete(fastFoodStoreId, fastFoodMealSetId,id) {
        return await RequestUtils.apiDelete(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${fastFoodMealSetId}/meal/${id}`);
    }

}