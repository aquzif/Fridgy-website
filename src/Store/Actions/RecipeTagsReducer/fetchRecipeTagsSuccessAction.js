
const fetchRecipeTagsSuccessAction = (state, action) => {
    let payload = action.payload;

    state.isLoading = false;
    state.error = false;
    state.errorMessage = '';
    state.recipeTags = payload;
}

export default fetchRecipeTagsSuccessAction;
