
const fetchGlobalUnitSuccessAction = (state, action) => {
    let payload = action.payload;

    state.isLoading = false;
    state.error = false;
    state.errorMessage = '';
    state.globalUnits = payload;
}

export default fetchGlobalUnitSuccessAction;
