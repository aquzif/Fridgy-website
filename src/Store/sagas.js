
import { takeLatest } from 'redux-saga/effects'
import {request,toggleEntry} from "@/Store/Reducers/ShoppingListReducer";
import fetchShoppingList from "@/Store/Sagas/ShoppingListReducer/fetchShoppingList";
import toggleShoppingListEntry from "@/Store/Sagas/ShoppingListReducer/toggleShoppingListEntry";




function* saga(){
    yield takeLatest(request().type,fetchShoppingList);
    yield takeLatest(toggleEntry().type,toggleShoppingListEntry);
}


export default saga;