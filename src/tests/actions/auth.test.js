import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Swal from "sweetalert2";
import { startChecking, startLogin, startRegister } from "../../actions/auth";
import { types } from "../../types/types";
import * as fetchModule from "../../helpers/fetch";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock("sweetalert2");

const initialState = {};
let store = mockStore(initialState);
Storage.prototype.setItem = jest.fn();

describe("Tests for Authentication actions", () => {
    beforeEach(() => {
        store = mockStore(initialState);
        jest.clearAllMocks();
    });

    test("Should dispatch correctly startLogin", async () => {
        await store.dispatch(startLogin("joseluis@mail.com", "123456"));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String),
            },
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "token",
            expect.any(String)
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "token-init-date",
            expect.any(Number)
        );

        // This way, we can get with what arguments a jest functions was called
        // Here, I'm getting, in an array, the arguments with wath the mock function was called all times
        // const allMockArgumentsCalled = localStorage.setItem.mock.calls;
        // console.log(allMockArgumentsCalled);

        // Here, I'm getting the second argument when the mock functions was executed in his first call
        // const secondArgumentFirstCall = localStorage.setItem.mock.calls[0][1];
        // console.log(secondArgumentFirstCall);
    });

    test("Should show errors when login is incorret with startLogin", async () => {
        await store.dispatch(startLogin("joseluis@mail.com", "123456777"));
        let actions = store.getActions();

        expect(actions).toEqual([]);
        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "Password is invalid",
            "error"
        );

        await store.dispatch(startLogin("joseluis5555@mail.com", "123456"));
        actions = store.getActions();

        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "User doesn't exist with provided email",
            "error"
        );
    });

    test("Should dispatch correctly startRegister", async () => {
        // We simulate te return of fetch function using a mock function return
        fetchModule.fetchWithoutToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: "123",
                    name: "José",
                    token: "ABC123DEF",
                };
            },
        }));

        await store.dispatch(
            startRegister("test@mail.com", "jluis", "1234556")
        );

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: "123",
                name: "José",
            },
        });

        expect(localStorage.setItem).toHaveBeenCalledWith("token", "ABC123DEF");
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "token-init-date",
            expect.any(Number)
        );
    });

    test("Should dispatch correctly startChecking", async () => {
        // We simulate te return of fetch function using a mock function return
        fetchModule.fetchWithToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: "123",
                    name: "José",
                    token: "ABC123DEF",
                };
            },
        }));

        await store.dispatch(startChecking());

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: "123",
                name: "José",
            },
        });

        expect(localStorage.setItem).toHaveBeenCalledWith("token", "ABC123DEF");
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "token-init-date",
            expect.any(Number)
        );
    });
});
