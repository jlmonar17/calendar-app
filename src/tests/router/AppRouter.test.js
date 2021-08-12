import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { AppRouter } from "../../router/AppRouter";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// store.dispatch = jest.fn();

describe("Tests for <AppRouter />", function () {
    test("Should show wait... message", () => {
        const initialState = {
            auth: {
                checking: true,
            },
        };

        const store = mockStore(initialState);

        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();

        expect(wrapper.find("h5").exists()).toBe(true);
    });

    test("Should show PublicRoute (LoginScreen)", () => {
        const initialState = {
            auth: {
                checking: false,
                uid: false,
            },
        };

        const store = mockStore(initialState);

        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(".login-container").exists()).toBe(true);
    });

    test("Should show PrivateRoute (CalendarScreen))", () => {
        const initialState = {
            ui: {
                modalOpen: false,
            },
            calendar: {
                events: [],
            },
            auth: {
                checking: false,
                uid: "abc123",
            },
        };

        const store = mockStore(initialState);

        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(".calendar-screen").exists()).toBe(true);
    });
});
