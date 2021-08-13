import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { CalendarModal } from "../../../components/calendar/CalendarModal";
import moment from "moment";
import {
    eventClearActiveEvent,
    eventStartAddNew,
    eventStartUpdate,
} from "../../../actions/events";
import Swal from "sweetalert2";
import { act } from "@testing-library/react";
jest.mock("../../../actions/events");
jest.mock("sweetalert2");

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, "hours");
const nowPlus1 = now.clone().add(1, "hours");

const initialState = {
    ui: {
        modalOpen: true,
    },
    calendar: {
        events: [],
        activeEvent: {
            title: "Hello",
            notes: "World",
            start: now.toDate(),
            end: nowPlus1.toDate(),
        },
    },
};
const store = mockStore(initialState);

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarModal />
    </Provider>
);

describe("Tests for <CalendarModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Should show modal", () => {
        expect(wrapper.find("Modal").prop("isOpen")).toBe(true);
    });

    test("Should call actions to update and close Modal", () => {
        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(eventStartUpdate).toHaveBeenCalledWith(
            initialState.calendar.activeEvent
        );
        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    test("Should show error if title is empty after next submit", () => {
        // Previus test, set active event to null because of eventClearActiveEvent, so, next time when we
        // simulate submit, title will be empty, so, it has to have clas "is-invalid"
        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(wrapper.find("input[name='title']").hasClass("is-invalid")).toBe(
            true
        );
    });

    test("Should create a new event", () => {
        const initialState = {
            ui: {
                modalOpen: true,
            },
            calendar: {
                events: [],
                activeEvent: null,
            },
        };
        const store = mockStore(initialState);

        store.dispatch = jest.fn();

        const wrapper = mount(
            <Provider store={store}>
                <CalendarModal />
            </Provider>
        );

        wrapper.find("input[name='title']").simulate("change", {
            target: {
                name: "title",
                value: "Hello world",
            },
        });

        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(eventStartAddNew).toHaveBeenCalledWith({
            start: expect.anything(),
            end: expect.anything(),
            title: "Hello world",
            notes: "",
        });

        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    test("Should validate Dates", () => {
        wrapper.find("input[name='title']").simulate("change", {
            target: {
                name: "title",
                value: "Hello world",
            },
        });

        const today = new Date();

        // We set today date to endDate
        act(() => {
            wrapper.find("DateTimePicker").at(1).prop("onChange")(today);
        });

        wrapper.find("form").simulate("submit", {
            preventDefault() {},
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            "Error",
            "End date should be greater than Start date",
            "error"
        );
    });
});
