import requestGlobalUnitsAction from "@/Store/Actions/GlobalUnitReducer/requestGlobalUnitsAction";
import {createSlice} from "@reduxjs/toolkit";
import fetchGlobalUnitSuccessAction from "@/Store/Actions/GlobalUnitReducer/fetchGlobalUnitSuccessAction";
import fetchGlobalUnitFailureAction from "@/Store/Actions/GlobalUnitReducer/fetchGlobalUnitFailureAction";

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
        requestGlobalUnits: requestGlobalUnitsAction,
        success: fetchGlobalUnitSuccessAction,
        failure: fetchGlobalUnitFailureAction
    }
});


export default globalUnitSlice.reducer;
export const {requestGlobalUnits, success, failure} = globalUnitSlice.actions;
