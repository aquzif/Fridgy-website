

const expire = (state, action) => {

    return {
        ...state,
        user: {},
        token: null,
        logoutReason: "TOKEN_EXPIRED"
    }


}

export default expire;
