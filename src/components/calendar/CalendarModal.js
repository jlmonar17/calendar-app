import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { uiCloseModal } from "../../actions/ui";
import { eventAddNew } from "../../actions/events";

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

// Make sure to bind modal to your appElement
Modal.setAppElement("#root");

const now = moment().minutes(0).seconds(0).add(1, "hours");
const nowPlus1 = now.clone().add(1, "hours");

export const CalendarModal = () => {
    const { modalOpen } = useSelector((state) => state.ui);

    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(now.toDate());
    const [endDate, setEndDate] = useState(nowPlus1.toDate());
    const [validTitle, setValidTitle] = useState(true);

    const [formValues, setFormValues] = useState({
        title: "Event",
        notes: "Notes",
        start: now.toDate(),
        end: nowPlus1.toDate(),
    });

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

        dispatch(
            eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: "abc",
                    name: "Luis",
                },
            })
        );

        setValidTitle(true);
        closeModal();
    };

    const closeModal = () => {
        dispatch(uiCloseModal());
    };

    const handleStartDateChange = (e) => {
        setStartDate(e);

        setFormValues({
            ...formValues,
            start: e,
        });
    };

    const handleEndDateChange = (e) => {
        setEndDate(e);

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
        >
            <h1>New event</h1>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>
                <div className="form-group">
                    <label>Start date and time</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                        value={startDate}
                    />
                </div>

                <div className="form-group">
                    <label>End date and time</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                        minDate={startDate}
                        value={endDate}
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
