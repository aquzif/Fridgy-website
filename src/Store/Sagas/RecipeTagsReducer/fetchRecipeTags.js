import NetworkUtils from "@/Utils/NetworkUtils";
import {failure, success} from "@/Store/Reducers/RecipeTagsReducer";
import RecipeTagsAPI from "@/API/RecipeTagsAPI";
import { put } from 'redux-saga/effects'

function* fetchRecipeTags (){

    if(!NetworkUtils.isOnline()) return;

    const response = yield RecipeTagsAPI.getAll();
    console.log(response);

    if(response.status !== 200) {
        yield put(failure(response.data.message));
    }else
        yield put(success(response.data.data));

}

export default fetchRecipeTags;
