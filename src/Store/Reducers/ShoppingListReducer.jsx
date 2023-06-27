import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    shoppingList: [],
    isLoading: false,
    error: false,
    errorMessage: ''
}


const shoppingListSlice = createSlice({
    name: 'shoppingList',
    initialState,
    reducers: {

    }
});


export const {} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
