import RequestUtils from "@/Utils/RequestUtils";

export default class CalendarEntryFastFoodAPI {
    static async getAll(calendarEntryId) {
        return await RequestUtils.apiGet(`/api/calendar-entry/${calendarEntryId}/fast-food-meal`);
    }

    static async get(calendarEntryId,id) {
        return await RequestUtils.apiGet(`/api/calendar-entry/${calendarEntryId}/fast-food-meal/${id}`);
    }

    static async create(calendarEntryId,data) {
        const result = await RequestUtils.apiPost(`/api/calendar-entry/${calendarEntryId}/fast-food-meal`, data);

        if(result.status >= 300){
            throw new Error('CalendarEntryFastFoodAPI.create() failed, status: ' + result.status);
        }

        return result;
    }

    static async update(calendarEntryId, id, data) {
        return await RequestUtils.apiPut(`/api/calendar-entry/${calendarEntryId}/fast-food-meal/${id}`, data);
    }

    static async delete(calendarEntryId, id) {
        return await RequestUtils.apiDelete(`/api/calendar-entry/${calendarEntryId}/fast-food-meal/${id}`);
    }
}