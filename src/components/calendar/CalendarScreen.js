import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Navbar } from "../ui/Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent } from "./CalendarEvent";
import { useState } from "react";
import { CalendarModal } from "./CalendarModal";
import { useDispatch, useSelector } from "react-redux";
import { uiOpenModal } from "../../actions/ui";
import {
    eventClearActiveEvent,
    eventSetActive,
    eventStartLoading,
} from "../../actions/events";
import { AddNewFab } from "../ui/AddNewFab";
import { DeleteEventFab } from "../ui/DeleteEventFab";
import { useEffect } from "react";
// Uncomment three lines below if you want translate text of calendar to Spanish
// import { messages } from "../../helpers/calendar-messages-es";
// import "moment/locale/es";
// moment.locale("es");

const messages = {
    previous: "<",
    next: ">",
    showMore: (total) => `+ Show more (${total})`,
};

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
    const dispatch = useDispatch();

    const { uid } = useSelector((state) => state.auth);

    // Getting events from Redux store
    const { events, activeEvent } = useSelector((state) => state.calendar);

    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );

    // It fires when a node event is double clicked
    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    };

    // It fires when a node event is selected
    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e));
    };

    // It is executed when user clicks slot from calendar
    const onSelectSlot = () => {
        dispatch(eventClearActiveEvent());
    };

    // It fires when a view calendar changes (month, week, day, agenda)
    const onViewChange = (e) => {
        // On refreshing page, we will keep last view selected, thanks to localStorage and state.
        localStorage.setItem("lastView", e);
        setLastView(e);
    };

    useEffect(() => {
        dispatch(eventStartLoading());
    }, [dispatch]);

    const eventStyleGetter = (event, start, end, isSelected) => {
        // Using a different backgroundColor color for event, if logged user is the owner of the event
        const style = {
            backgroundColor: uid === event.user._id ? "#367CF7" : "#464646",
            broderRadius: "0px",
            opacity: 0.8,
            display: "block",
            color: "white",
        };

        return { style };
    };

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable={true}
                onView={onViewChange}
                view={lastView}
                components={{
                    event: CalendarEvent,
                }}
            />

            <AddNewFab />
            {activeEvent && <DeleteEventFab />}

            <CalendarModal />
        </div>
    );
};
