import { useDispatch, useSelector } from "react-redux";
import { eventDeleted } from "../../actions/events";

export const DeleteEventFab = () => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(eventDeleted());
    };

    return (
        <button className="btn btn-danger fab-danger" onClick={handleDelete}>
            <i className="fa fa-trash"></i>
            <span> Delete event</span>
        </button>
    );
};
