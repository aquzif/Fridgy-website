
import { takeLatest } from 'redux-saga/effects'
import {request} from "@/Store/Reducers/ShoppingListReducer";
import fetchShoppingList from "@/Store/Sagas/ShoppingListReducer/fetchShoppingList";



function* saga(){
    yield takeLatest(request().type,fetchShoppingList);
}


export default saga;