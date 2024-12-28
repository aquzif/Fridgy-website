import {createSlice} from "@reduxjs/toolkit";

import requestProductAction from "@/Store/Actions/ProductReducer/requestProductAction";
import fetchProductSuccessAction from "@/Store/Actions/ProductReducer/fetchProductSuccessAction";
import fetchProductFailureAction from "@/Store/Actions/ProductReducer/fetchProductFailureAction";


const initialState = {
    products: [],
    isLoading: false,
    error: false,
    errorMessage: ''
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers:{
        requestProducts: requestProductAction,
        success: fetchProductSuccessAction,
        failure: fetchProductFailureAction
    }
});

export default productSlice.reducer;
export const {requestProducts, success, failure} = productSlice.actions;
