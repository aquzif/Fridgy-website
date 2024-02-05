import RequestUtils from "@/Utils/RequestUtils";

export default class CalendarEntriesAPI {

    static async getAll(dateFrom,dateTo) {
        return await RequestUtils.apiGet(`/api/calendar-entry?date_from=${dateFrom}&date_to=${dateTo}`);
    }

    static async get(id) {
        return await RequestUtils.apiGet('/api/calendar-entry/' + id);
    }

    static async create(data) {
        const result = await RequestUtils.apiPost('/api/calendar-entry', data);

        if(result.status >=300){
            throw new Error('CalendarEntriesAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(id, data) {
        return await RequestUtils.apiPut('/api/calendar-entry/' + id, data);
    }

    static async delete(id) {
        return await RequestUtils.apiDelete('/api/calendar-entry/' + id);
    }

}
