
const fetchProductSuccessAction = (state, action) => {
    let payload = action.payload;

    state.isLoading = false;
    state.error = false;
    state.errorMessage = '';
    state.products = payload;
}

export default fetchProductSuccessAction;
