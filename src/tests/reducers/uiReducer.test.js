import { uiCloseModal, uiOpenModal } from "../../actions/ui";
import { uiReducer } from "../../reducers/uiReducer";

const initialState = {
    modalOpen: false,
};

describe("Tests for uiReducer", function () {
    test("Should return default state", () => {
        const state = uiReducer(initialState, {});

        expect(state).toEqual(initialState);
    });

    test("Should open and close modal", () => {
        const openAction = uiOpenModal();
        const state = uiReducer(initialState, openAction);

        expect(state).toEqual({ modalOpen: true });

        const closeAction = uiCloseModal();
        const stateClose = uiReducer(state, closeAction);

        expect(stateClose).toEqual({ modalOpen: false });
    });
});
