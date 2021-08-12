import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { CalendarScreen } from "../../../components/calendar/CalendarScreen";
import { eventSetActive } from "../../../actions/events";
import { types } from "../../../types/types";
import { act } from "react-dom/cjs/react-dom-test-utils.development";
jest.mock("../../../actions/events");
Storage.prototype.setItem = jest.fn();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {
    calendar: {
        events: [],
    },
    auth: {
        uid: "abc123",
        name: "J Luis",
    },
    ui: {
        modalOpen: false,
    },
};
const store = mockStore(initialState);

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarScreen />
    </Provider>
);

describe("Tests for <CalendarScreen />", () => {
    test("Should render correctly", () => {
        expect(wrapper).toMatchSnapshot();
    });

    test("Should work interactions with Calendar", () => {
        const calendar = wrapper.find("Calendar");

        const calendarMessages = calendar.prop("messages");
        expect(calendarMessages).toEqual({
            previous: "<",
            next: ">",
            showMore: expect.any(Function),
        });

        calendar.prop("onSelectEvent")({ start: "Hello" });
        expect(eventSetActive).toHaveBeenCalledWith({ start: "Hello" });

        calendar.prop("onDoubleClickEvent")();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: types.uiOpenModal,
        });

        act(() => {
            calendar.prop("onView")("week");
            expect(localStorage.setItem).toHaveBeenCalledWith(
                "lastView",
                "week"
            );
        });
    });
});
