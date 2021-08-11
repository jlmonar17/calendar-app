import Swal from "sweetalert2";
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import { eventLogout } from "./events";

export const startLogin = (email, password) => {
    return async (dispatch) => {
        const response = await fetchWithoutToken(
            "auth",
            { email, password },
            "POST"
        );
        const body = await response.json();

        if (body.ok) {
            localStorage.setItem("token", body.token);
            localStorage.setItem("token-init-date", new Date().getTime());

            const user = {
                uid: body.uid,
                name: body.name,
            };

            dispatch(login(user));
        } else {
            Swal.fire("Error", body.msg, "error");
        }
    };
};

export const startRegister = (email, name, password) => {
    return async (dispatch) => {
        const response = await fetchWithoutToken(
            "auth/new",
            { email, name, password },
            "POST"
        );
        const body = await response.json();

        if (body.ok) {
            localStorage.setItem("token", body.token);
            localStorage.setItem("token-init-date", new Date().getTime());

            const user = {
                uid: body.uid,
                name: body.name,
            };

            dispatch(login(user));
        } else {
            Swal.fire("Error", body.msg, "error");
        }
    };
};

const login = (user) => ({
    type: types.authLogin,
    payload: user,
});

export const startChecking = () => {
    return async (dispatch) => {
        const response = await fetchWithToken("auth/renew");
        const body = await response.json();

        if (body.ok) {
            localStorage.setItem("token", body.token);
            localStorage.setItem("token-init-date", new Date().getTime());

            const user = {
                uid: body.uid,
                name: body.name,
            };

            dispatch(login(user));
        } else {
            dispatch(checkingFinish());
        }
    };
};

const checkingFinish = () => ({
    type: types.authCheckingFinish,
});

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();

        dispatch(eventLogout());
        dispatch(logout());
    };
};

const logout = () => ({
    type: types.authLogout,
});
