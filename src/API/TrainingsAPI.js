import RequestUtils from "@/Utils/RequestUtils";

export default class TrainingsAPI {

    static async getAll(dateFrom,dateTo) {
        return await RequestUtils.apiGet(`/api/training?date_from=${dateFrom}&date_to=${dateTo}`);
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/training/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/training', data);

        if(result.status >=300){
            throw new Error('CalendarEntriesAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/training/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/training/' + id);
    }

}
