import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import EventForm from '../component/form/EventForm'
import DatePicker from "react-datepicker";

const Events = () => {
  const [panel, setPanel] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  return (
   <h1>calendar</h1>
  )
}

export default Events
