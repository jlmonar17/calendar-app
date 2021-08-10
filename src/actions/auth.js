import { fetchWithoutToken } from "../helpers/fetch";
import { types } from "../types/types";

export const startLogin = (email, password) => {
    return async (dispatch) => {
        console.log(email, password);

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
        }
    };
};

const login = (user) => ({
    type: types.authLogin,
    payload: user,
});
