export default class DatesUtils {
    static getDatesBetween(dateFrom, dateTo) {
        const dates = [];
        let currentDate = dateFrom;
        while(currentDate.isBefore(dateTo)){
            dates.push(currentDate);
            currentDate = currentDate.add(1,'day');
        }
        return dates;
    }

    static getNameOfWeekDay(date) {
        return date.format('dddd');
    }
}