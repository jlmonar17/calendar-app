import { types } from "../../types/types";

describe("Tests for types.js", () => {
    test("Types should be equals", () => {
        expect(types).toEqual({
            uiOpenModal: "[UI] Open modal",
            uiCloseModal: "[UI] Close modal",

            eventSetActive: "[event] Set active",
            eventStartAddNew: "[event] Start add new",
            eventAddNew: "[event] Add new",
            eventClearActiveEvent: "[event] Clear active event",
            eventUpdated: "[event] Event updated",
            eventDeleted: "[event] Event deleted",
            eventsLoaded: "[event] Events loaded",
            eventLogout: "[event] Event logout",

            authChecking: "[Auth] Checking login state",
            authCheckingFinish: "[Auth] Finish checking login state",
            authStartLogin: "[Auth] Start login",
            authLogin: "[Auth] Login",
            authStartregister: "[Auth] Start register",
            authStartTokenRenew: "[Auth] Start token renew",
            authLogout: "[Auth] Logout",
        });
    });
});
