import {createSlice} from "@reduxjs/toolkit";
import requestRecipeTagsAction from "@/Store/Actions/RecipeTagsReducer/requestRecipeTagsAction";
import fetchRecipeTagsSuccessAction from "@/Store/Actions/RecipeTagsReducer/fetchRecipeTagsSuccessAction";
import fetchRecipeTagsFailureAction from "@/Store/Actions/RecipeTagsReducer/fetchRecipeTagsFailureAction";

const initialState = {
    recipeTags: [],
    isLoading: false,
    error: false,
    errorMessage: ''
}

const recipeTagsSlice = createSlice({
    name: 'recipeTags',
    initialState,
    reducers:{
        requestRecipeTags: requestRecipeTagsAction,
        success: fetchRecipeTagsSuccessAction,
        failure: fetchRecipeTagsFailureAction
    }
});


export default recipeTagsSlice.reducer;
export const {requestRecipeTags, success, failure} = recipeTagsSlice.actions;
