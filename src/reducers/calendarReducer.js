import moment from "moment";
import { types } from "../types/types";

const initialState = {
    events: [
        {
            title: "My Birthday",
            notes: "Buy cake",
            start: moment().toDate(),
            end: moment().add(2, "hours").toDate(),
            bgColor: "#FAFAFA",
            user: {
                _id: "123",
                name: "José",
            },
        },
    ],
    activeEvent: null,
};

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload,
            };

        case types.eventAddNew:
            return {
                ...state,
                events: [...state.events, action.payload],
            };

        default:
            return state;
    }
};
