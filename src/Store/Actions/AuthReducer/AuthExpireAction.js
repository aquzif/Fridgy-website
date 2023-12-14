import toast from "react-hot-toast";


const expire = (state, action) => {

    toast.error("Sesja wygasła, zaloguj się ponownie");

    return {
        ...state,
        user: {},
        token: null,
        logoutReason: "TOKEN_EXPIRED"
    }


}

export default expire;
