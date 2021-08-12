import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { DeleteEventFab } from "../../components/ui/DeleteEventFab";
import { Provider } from "react-redux";
import { eventStartDelete } from "../../actions/events";
jest.mock("../../actions/events");

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {};
const store = mockStore(initialState);

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <DeleteEventFab />
    </Provider>
);

describe("Tests for <DeleteEventFab/>", () => {
    test("Should render correctly", () => {
        expect(wrapper).toMatchSnapshot();
    });

    test("Should call eventStartDelete on click button", () => {
        wrapper.find("button").simulate("click");

        expect(store.dispatch).toHaveBeenCalled();
        expect(eventStartDelete).toHaveBeenCalled();
    });
});
