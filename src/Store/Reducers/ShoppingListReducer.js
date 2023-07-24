import {createSlice} from "@reduxjs/toolkit";
import requestShoppingListsAction from "@/Store/Actions/ShoppingListReducer/requestShoppingListsAction";
import fetchShoppingListSuccessAction from "@/Store/Actions/ShoppingListReducer/fetchShoppingListSuccessAction";
import fetchShoppingListFailureAction from "@/Store/Actions/ShoppingListReducer/fetchShoppingListFailureAction";
import selectShoppingListAction from "@/Store/Actions/ShoppingListReducer/selectShoppingListAction";
import toggleShoppingListEntryCheckAction from "@/Store/Actions/ShoppingListReducer/toggleShoppingListEntryCheckAction";


const initialState = {
    shoppingLists: [],
    isLoading: false,
    error: false,
    errorMessage: '',
    selectedShoppingListID: 0
}


const shoppingListSlice = createSlice({
    name: 'shoppingList',
    initialState,
    reducers: {
        requestShoppingLists: requestShoppingListsAction,
        success: fetchShoppingListSuccessAction,
        failure: fetchShoppingListFailureAction,
        selectShoppingList: selectShoppingListAction,
        toggleEntry: toggleShoppingListEntryCheckAction
    }
});


export const {requestShoppingLists
    ,success
    ,failure
    ,selectShoppingList
    ,toggleEntry
} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
