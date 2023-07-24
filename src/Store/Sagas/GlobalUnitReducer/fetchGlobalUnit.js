import NetworkUtils from "@/Utils/NetworkUtils";
import GlobalUnitsAPI from "@/API/GlobalUnitsAPI";
import {success,failure} from "@/Store/Reducers/GlobalUnitReducer";
import { put } from 'redux-saga/effects'

function* fetchGlobalUnit() {
    if(!NetworkUtils.isOnline()) return;

    const response = yield GlobalUnitsAPI.getAll();
    console.log(response.data.data);
    if(response.status !== 200) {
        yield put(failure(response.data.message));
    }else
        yield put(success(response.data.data));



}

export default fetchGlobalUnit;
