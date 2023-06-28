
const selectShoppingListAction = (state,action) => {
    state.selectedShoppingListID = action.payload;
}

export default selectShoppingListAction;