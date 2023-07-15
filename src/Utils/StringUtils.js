
export default class StringUtils {
    static trimObjectValues(obj) {
        Object.keys(obj).map(key => {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].trim();
            } else {
                StringUtils.trimObjectValues(obj[key]);
            }
        });

        return obj;
    }
}