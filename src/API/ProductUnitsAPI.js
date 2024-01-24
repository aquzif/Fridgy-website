import RequestUtils from "@/Utils/RequestUtils";

export default class ProductUnitsAPI {
    static async getAll(productId) {
        return await RequestUtils.apiGet(`/api/product/${productId}/unit`);
    }

    static async get(productId,id) {
        return await RequestUtils.apiGet(`/api/product/${productId}/unit/${id}`);
    }

    static async create(productId,data) {
        const result = await RequestUtils.apiPost(`/api/product/${productId}/unit`, data);

        if(result.status !== 201){
            throw new Error('ProductUnitsAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(productId, id, data) {
        return await RequestUtils.apiPut(`/api/product/${productId}/unit/${id}`, data);
    }

    static async delete(productId, id) {
        return await RequestUtils.apiDelete(`/api/product/${productId}/unit/${id}`);
    }
}