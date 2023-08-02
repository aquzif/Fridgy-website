import {createSlice} from "@reduxjs/toolkit";
import requestProductCategoryAction from "@/Store/Actions/ProductCategoryReducer/requestProductCategoryAction";
import fetchProductCategorySuccessAction
    from "@/Store/Actions/ProductCategoryReducer/fetchProductCategorySuccessAction";
import fetchProductCategoryFailureAction
    from "@/Store/Actions/ProductCategoryReducer/fetchProductCategoryFailureAction";


const initialState = {
    productCategories: [],
    isLoading: false,
    error: false,
    errorMessage: ''
}

const productCategorySlice = createSlice({
    name: 'productCategory',
    initialState,
    reducers:{
        requestProductCategories: requestProductCategoryAction,
        success: fetchProductCategorySuccessAction,
        failure: fetchProductCategoryFailureAction
    }
});

export default productCategorySlice.reducer;
export const {requestProductCategories, success, failure} = productCategorySlice.actions;
