import {createSlice} from "@reduxjs/toolkit";
import AuthLoginAction from "@/Store/Actions/AuthReducer/AuthLoginAction";
import AuthLogoutAction from "@/Store/Actions/AuthReducer/AuthLogoutAction";
import AuthExpireAction from "@/Store/Actions/AuthReducer/AuthExpireAction";
import AuthClearLogoutReasonAction from "@/Store/Actions/AuthReducer/AuthClearLogoutReasonAction";
import LocalStorageUtils from "@/Utils/LocalStorageUtils";
import AuthRefreshUserAction from "@/Store/Actions/AuthReducer/AuthRefreshUserAction";
import AuthRefreshUserSuccess from "@/Store/Actions/AuthReducer/AuthRefreshUserSuccess";


const initialState ={
    user: {},
    token: null,
    logoutReason: "",
    ...LocalStorageUtils.getData('auth')
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: AuthLoginAction,
        logout: AuthLogoutAction,
        expire: AuthExpireAction,
        clearLogoutReason: AuthClearLogoutReasonAction,
        refreshUser: AuthRefreshUserAction,
        refreshSuccess: AuthRefreshUserSuccess,
    }
})


export const {refreshSuccess,refreshUser,login, logout,expire,clearLogoutReason} = authSlice.actions;
export default authSlice.reducer;
