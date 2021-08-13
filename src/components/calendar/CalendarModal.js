import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { uiCloseModal } from "../../actions/ui";
import {
    eventClearActiveEvent,
    eventStartAddNew,
    eventStartUpdate,
} from "../../actions/events";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

if (process.env.NODE_ENV !== "test") {
    // Make sure to bind modal to your appElement
    Modal.setAppElement("#root");
}

const now = moment().minutes(0).seconds(0).add(1, "hours");
const nowPlus1 = now.clone().add(1, "hours");

const initEvent = {
    title: "",
    notes: "",
    start: now.toDate(),
    end: nowPlus1.toDate(),
};

export const CalendarModal = () => {
    const { modalOpen } = useSelector((state) => state.ui);
    const { activeEvent } = useSelector((state) => state.calendar);

    const dispatch = useDispatch();

    const [validTitle, setValidTitle] = useState(true);

    const [formValues, setFormValues] = useState(initEvent);

    const { title, notes, start, end } = formValues;

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            return Swal.fire(
                "Error",
                "End date should be greater than Start date",
                "error"
            );
        }

        if (title.trim().length < 2) {
            return setValidTitle(false);
        }

        // If activeEvent exists, it means that an event was loaded in modal, therefore, we
        // update the event
        if (activeEvent) {
            dispatch(eventStartUpdate(formValues));
        } else {
            dispatch(eventStartAddNew(formValues));
        }

        setValidTitle(true);
        closeModal();
    };

    useEffect(() => {
        // It will set formValues only if there is some active event
        if (activeEvent) {
            setFormValues(activeEvent);
        } else {
            setFormValues(initEvent);
        }
    }, [activeEvent]);

    const closeModal = () => {
        dispatch(uiCloseModal());

        // Set active event with null value in Redux store
        dispatch(eventClearActiveEvent());

        // Reset form values
        setFormValues(initEvent);
    };

    const handleStartDateChange = (e) => {
        setFormValues({
            ...formValues,
            start: e,
        });
    };

    const handleEndDateChange = (e) => {
        setFormValues({
            ...formValues,
            end: e,
        });
    };

    return (
        <Modal
            className="modal"
            overlayClassName="modal-fondo"
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            ariaHideApp={!process.env.NODE_ENV === "test"}
        >
            <h1>{activeEvent ? "Edit event" : "New event"}</h1>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>
                <div className="form-group">
                    <label>Start date and time</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                        value={start}
                    />
                </div>

                <div className="form-group">
                    <label>End date and time</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                        minDate={start}
                        value={end}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Title and notes</label>
                    <input
                        type="text"
                        className={`form-control ${
                            !validTitle && "is-invalid"
                        }`}
                        placeholder="Title event"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        Short description
                    </small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notes"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">
                        Additional information
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save</span>
                </button>
            </form>
        </Modal>
    );
};
