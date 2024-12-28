

const fetchProductFailureAction = (state, action) => {
    let payload = action.payload;

    state.isLoading = false;
    state.error = true;
    state.errorMessage = payload;

}

export default fetchProductFailureAction;
