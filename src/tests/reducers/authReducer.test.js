import { authReducer } from "../../reducers/authReducer";
import { types } from "../../types/types";

const initialState = {
    checking: true,
};

describe("Tests for authReducer", () => {
    test("Should return default state", () => {
        const state = authReducer(initialState, {});

        expect(state).toEqual(initialState);
    });

    test("Should login correctly", () => {
        const loginAction = {
            type: types.authLogin,
            payload: {
                uid: "123abc",
                name: "jluis",
            },
        };

        const state = authReducer(initialState, loginAction);

        expect(state).toEqual({
            checking: false,
            uid: "123abc",
            name: "jluis",
        });
    });
});
