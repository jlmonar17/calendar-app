import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { LoginScreen } from "../../../components/auth/LoginScreen";
import { startLogin, startRegister } from "../../../actions/auth";
import Swal from "sweetalert2";
jest.mock("../../../actions/auth");
jest.mock("sweetalert2");

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {};
const store = mockStore(initialState);

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <LoginScreen />
    </Provider>
);

describe("Tests for <LoginScreen />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Should render correctly", () => {
        expect(wrapper).toMatchSnapshot();
    });

    test("Should call dispatch on click login", () => {
        wrapper.find("input[name='lEmail']").simulate("change", {
            target: {
                name: "lEmail",
                value: "test@mail.com",
            },
        });

        wrapper.find("input[name='lPassword']").simulate("change", {
            target: {
                name: "lPassword",
                value: "123456",
            },
        });

        wrapper
            .find("form")
            .at(0)
            .simulate("submit", {
                preventDefault() {},
            });

        expect(startLogin).toHaveBeenCalledWith("test@mail.com", "123456");
    });

    test("Should reject register if passwords are different", () => {
        wrapper.find("input[name='rPassword1']").simulate("change", {
            target: {
                name: "rPassword1",
                value: "123456",
            },
        });

        wrapper.find("input[name='rPassword2']").simulate("change", {
            target: {
                name: "rPassword2",
                value: "1234567",
            },
        });

        wrapper
            .find("form")
            .at(1)
            .simulate("submit", {
                preventDefault() {},
            });

        expect(startRegister).not.toHaveBeenCalled();
        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "Passwords must be equal",
            "error"
        );
    });

    test("Should dispatch startRegister on submit register", () => {
        wrapper.find("input[name='rPassword1']").simulate("change", {
            target: {
                name: "rPassword1",
                value: "123456",
            },
        });

        wrapper.find("input[name='rPassword2']").simulate("change", {
            target: {
                name: "rPassword2",
                value: "123456",
            },
        });

        wrapper
            .find("form")
            .at(1)
            .simulate("submit", {
                preventDefault() {},
            });

        expect(startRegister).toHaveBeenCalledWith("", "", "123456");
        expect(Swal.fire).not.toHaveBeenCalled();
    });
});
