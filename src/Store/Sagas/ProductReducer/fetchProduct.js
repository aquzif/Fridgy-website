import NetworkUtils from "@/Utils/NetworkUtils";
import GlobalUnitsAPI from "@/API/GlobalUnitsAPI";
import {failure, success} from "@/Store/Reducers/ProductReducer";
import ProductCategoriesAPI from "@/API/ProductCategoriesAPI";
import { put } from 'redux-saga/effects'
import ProductAPI from "@/API/ProductsAPI";

function* fetchProduct (){

    if(!NetworkUtils.isOnline()) return;

    const response = yield ProductAPI.getAll();
    console.log(response);

    if(response.status !== 200) {
        yield put(failure(response.data.message));
    }else
        yield put(success(response.data.data));

}

export default fetchProduct;
