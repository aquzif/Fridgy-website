import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./Reducers/AuthReducer";
import LocalStorageUtils from "@/Utils/LocalStorageUtils";

const store = configureStore({
    reducer: {
        authReducer
    }
});

store.subscribe(LocalStorageUtils.saveState);


export default store;

