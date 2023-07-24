
const fetchShoppingListSuccessAction = (state, action) => {
    let payload = action.payload;

    state.isLoading = false;
    state.error = false;
    state.errorMessage = '';
    state.shoppingLists = payload;

}


export default fetchShoppingListSuccessAction;
