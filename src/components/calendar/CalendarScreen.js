import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Navbar } from "../ui/Navbar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent } from "./CalendarEvent";
import { useState } from "react";
import { CalendarModal } from "./CalendarModal";
import { useDispatch } from "react-redux";
import { uiOpenModal } from "../../actions/ui";
import { eventSetActive } from "../../actions/events";
import { AddNewFab } from "../ui/AddNewFab";
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

const events = [
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
];

export const CalendarScreen = () => {
    const dispatch = useDispatch();

    const [lastView, setLastView] = useState(
        localStorage.getItem("lastView") || "month"
    );

    // It fires when a node event is double clicked
    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    };

    // It fires when a node event is selected
    const onSelectEvent = (e) => {
        console.log(e);
        dispatch(eventSetActive(e));
    };

    // It fires when a view calendar changes (month, week, day, agenda)
    const onViewChange = (e) => {
        // On refreshing page, we will keep last view selected, thanks to localStorage and state.
        localStorage.setItem("lastView", e);
        setLastView(e);
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: "#367CF7",
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
                onView={onViewChange}
                view={lastView}
                components={{
                    event: CalendarEvent,
                }}
            />

            <AddNewFab />
            <CalendarModal />
        </div>
    );
};
