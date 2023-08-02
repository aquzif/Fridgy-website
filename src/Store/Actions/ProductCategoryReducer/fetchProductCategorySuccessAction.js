
const fetchProductCategorySuccessAction = (state, action) => {
    let payload = action.payload;

    state.isLoading = false;
    state.error = false;
    state.errorMessage = '';
    state.productCategories = payload;
}

export default fetchProductCategorySuccessAction;
