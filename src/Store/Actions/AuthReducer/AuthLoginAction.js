const login = (state, action) => {
    let payload = action.payload;

    state.logoutReason = "";
    state.user = payload.user;
    state.token = payload.token;

}

export default login;
