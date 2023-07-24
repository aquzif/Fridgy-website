import requestGlobalUnitsAction from "@/Store/Actions/GlobalUnitReducer/requestGlobalUnitsAction";
import {createSlice} from "@reduxjs/toolkit";
import fetchGlobalUnitSuccessAction from "@/Store/Actions/GlobalUnitReducer/fetchGlobalUnitSuccessAction";

const initialState = {
    globalUnits: [],
    isLoading: false,
    error: false,
    errorMessage: ''
}

const globalUnitSlice = createSlice({
    name: 'globalUnit',
    initialState,
    reducers:{
        request: requestGlobalUnitsAction,
        success: fetchGlobalUnitSuccessAction,
        failure: fetchGlobalUnitFailureAction
    }
});


export default globalUnitSlice.reducer;
export const {request, success, failure} = globalUnitSlice.actions;
