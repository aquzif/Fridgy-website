const logout = (state, action) => {

    return {
        ...state,
        user: {},
        token: null,
        logoutReason: "USER_LOGGED_OUT"
    }

}

export default logout;
