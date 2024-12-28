import NetworkUtils from "@/Utils/NetworkUtils";
import {refreshSuccess} from "@/Store/Reducers/AuthReducer";
import UserAPI from "@/API/UserAPI";
import toast from "react-hot-toast";
import { put } from 'redux-saga/effects';

function* fetchUser() {
    if(!NetworkUtils.isOnline()) return;

    const response = yield UserAPI.getUser();

    if(response.status !== 200) {
        toast.error('Nie udało się pobrać danych użytkownika');
    }else
        yield put(refreshSuccess(response.data));



}

export default fetchUser;