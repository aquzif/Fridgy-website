
import { takeLatest } from 'redux-saga/effects'
import {requestShoppingLists,toggleEntry} from "@/Store/Reducers/ShoppingListReducer";
import {requestGlobalUnits} from "@/Store/Reducers/GlobalUnitReducer";
import fetchShoppingList from "@/Store/Sagas/ShoppingListReducer/fetchShoppingList";
import toggleShoppingListEntry from "@/Store/Sagas/ShoppingListReducer/toggleShoppingListEntry";
import fetchGlobalUnit from "@/Store/Sagas/GlobalUnitReducer/fetchGlobalUnit";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";



function* saga(){
    yield takeLatest(requestShoppingLists().type,fetchShoppingList);
    yield takeLatest(toggleEntry().type,toggleShoppingListEntry);
    yield takeLatest(requestGlobalUnits().type, fetchGlobalUnit);
    yield takeLatest(requestProductCategories().type, fetchGlobalUnit);
}


export default saga;
