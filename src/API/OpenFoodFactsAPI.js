export default class OpenFoodFactsAPI {
    static async getProductViaBarcode(barcode) {
        const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
}