
const fetchGlobalUnitFailureAction = (state, action) => {
    let payload = action.payload;

    state.isLoading = false;
    state.error = true;
    state.errorMessage = payload;

}

export default fetchGlobalUnitFailureAction;
