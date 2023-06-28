import {createSlice} from "@reduxjs/toolkit";
import requestShoppingListsAction from "@/Store/Actions/ShoppingListReducer/requestShoppingListsAction";
import fetchShoppingListSuccessAction from "@/Store/Actions/ShoppingListReducer/fetchShoppingListSuccessAction";
import fetchShoppingListFailureAction from "@/Store/Actions/ShoppingListReducer/fetchShoppingListFailureAction";
import selectShoppingListAction from "@/Store/Actions/ShoppingListReducer/selectShoppingListAction";


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
        request: requestShoppingListsAction,
        success: fetchShoppingListSuccessAction,
        failure: fetchShoppingListFailureAction,
        selectShoppingList: selectShoppingListAction,
    }
});


export const {request
    ,success
    ,failure
    ,selectShoppingList
} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
