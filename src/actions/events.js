import { fetchWithToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStartAddNew = (event) => {
    return async (dispatch, getState) => {
        const { uid, name } = getState().auth;

        const res = await fetchWithToken("events", event, "POST");
        const body = await res.json();

        if (body.ok) {
            event.id = body.event.id;
            event.user = {
                _id: uid,
                name,
            };

            console.log(event);

            dispatch(eventAddNew(event));
        }
    };
};

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event,
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event,
});

export const eventClearActiveEvent = () => ({
    type: types.eventClearActiveEvent,
});

export const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event,
});

export const eventDeleted = () => ({
    type: types.eventDeleted,
});

export const eventStartLoading = () => {
    return async (dispatch) => {
        try {
            const response = await fetchWithToken("events");
            const body = await response.json();

            const events = prepareEvents(body.events);

            if (body.ok) {
                dispatch(eventsLoaded(events));
            }
        } catch (error) {
            console.log(error);
        }
    };
};

const eventsLoaded = (events) => ({
    type: types.eventsLoaded,
    payload: events,
});
