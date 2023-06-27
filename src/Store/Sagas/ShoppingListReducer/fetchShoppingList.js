import NetworkUtils from "@/Utils/NetworkUtils";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import { put } from 'redux-saga/effects'
import {failure, selectShoppingList, success} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";

function* fetchShoppingList(){
    if(!NetworkUtils.isOnline()) return;

    const response = yield ShoppingListsAPI.getAll();

    if(response.status !== 200){
        yield put(failure(response?.message));
        return;
    }

    const {data} = response;
    const {selectedShoppingListID} = store.getState().shoppingListReducer;

    if(data.length === 0)
        yield put(selectShoppingList(0));
    else if(data.filter(list => list.id === selectedShoppingListID).length === 0)
        yield put(selectShoppingList(data[0]?.id));

    yield put(success(response.data));

}

export default fetchShoppingList;