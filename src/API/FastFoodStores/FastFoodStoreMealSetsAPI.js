import RequestUtils from "@/Utils/RequestUtils";


export default class FastFoodStoreMealSetsAPI {

    static async getAll(fastFoodStoreId,page = 1) {
        return await RequestUtils.apiGet(`/api/fast-food-store/${fastFoodStoreId}/meal-set`);
    }

    static async search(fastFoodStoreId,search) {
        return await RequestUtils.apiGet(`/api/fast-food-store/${fastFoodStoreId}/meal-set/search?query=${encodeURI(search)}`);
    }

    static async get(fastFoodStoreId,id) {
        return await RequestUtils.apiGet(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${id}`);
    }

    static async create(fastFoodStoreId,data) {
        const result = await RequestUtils.apiPost(`/api/fast-food-store/${fastFoodStoreId}/meal-set`, data);

        if(result.status > 300){
            throw new Error('FastFoodStoreMealsAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(fastFoodStoreId, id, data) {
        return await RequestUtils.apiPut(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${id}`, data);
    }

    static async delete(fastFoodStoreId,id) {
        return await RequestUtils.apiDelete(`/api/fast-food-store/${fastFoodStoreId}/meal-set/${id}`);
    }

}