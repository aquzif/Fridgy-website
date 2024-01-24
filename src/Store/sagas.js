
import { takeLatest } from 'redux-saga/effects'
import {requestShoppingLists,toggleEntry} from "@/Store/Reducers/ShoppingListReducer";
import {requestGlobalUnits} from "@/Store/Reducers/GlobalUnitReducer";
import fetchShoppingList from "@/Store/Sagas/ShoppingListReducer/fetchShoppingList";
import toggleShoppingListEntry from "@/Store/Sagas/ShoppingListReducer/toggleShoppingListEntry";
import fetchGlobalUnit from "@/Store/Sagas/GlobalUnitReducer/fetchGlobalUnit";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";
import fetchGlobalCategories from "@/Store/Sagas/ProductCategoryReducer/fetchGlobalCategories";
import {requestProducts} from "@/Store/Reducers/ProductReducer";
import fetchProduct from "@/Store/Sagas/ProductReducer/fetchProduct";



function* saga(){
    yield takeLatest(requestShoppingLists().type,fetchShoppingList);
    yield takeLatest(toggleEntry().type,toggleShoppingListEntry);
    yield takeLatest(requestGlobalUnits().type, fetchGlobalUnit);
    yield takeLatest(requestProductCategories().type, fetchGlobalCategories);
    yield takeLatest(requestProducts().type, fetchProduct);
}


export default saga;
