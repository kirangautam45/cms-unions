/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// import { useMemo } from "react";
import EventCalendar from "../components/Calendar";

function EventsCalendar({details}){
  const calendarEventsData = details.calendarEventsData; 
  const eventsInitialDate = details.eventsInitialDate; 
  console.log("eventsInitialDate>>>>:", calendarEventsData, eventsInitialDate);
  // eventsInitialDate===""?"2021-08-19":eventsInitialDate
  const eventInitDateLocal = (eventsInitialDate===""?"2021-08-19":eventsInitialDate);
  // console.log("eventInitDateLocal>>>>", eventInitDateLocal);

  return (
    <div>
    {/* 
    template is using use Memo, so have plan the calendar to not load again and again, 
    but we have calendar on right, that's why i will make it without useMemo
    useMemo(
      () => (
        <EventCalendar
          initialView="dayGridMonth"
          initialDate={eventInitDateLocal}
          events={calendarEventsData}
          dateClick={()=>{alert("Date click");}}
          selectable
          editable
        />
      ),
      [calendarEventsData]
      ) */}
      {eventsInitialDate}
      <EventCalendar
        initialView="dayGridMonth"
        initialDate={eventInitDateLocal}
        events={calendarEventsData}
        dateClick={()=>{alert("Date click");}}
        selectable
        editable
      />
    </div>
  );
}

export default EventsCalendar;