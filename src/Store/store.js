import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./Reducers/AuthReducer";
import LocalStorageUtils from "@/Utils/LocalStorageUtils";
import shoppingListReducer from "@/Store/Reducers/ShoppingListReducer";

import createSagaMiddleware from 'redux-saga'
import saga from "@/Store/sagas";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        authReducer,
        shoppingListReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(saga)

store.subscribe(LocalStorageUtils.saveState);

export default store;

