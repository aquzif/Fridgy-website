

export default class ArrayUtils {

    static groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }

    static objectToArray(object) {
        return Object.keys(object).map(key => {
            return {key: key, value: object[key]}
        })
    }



}
