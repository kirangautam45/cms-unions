/* eslint-disable object-shorthand */
/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useMemo, useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";

import { createAPI, updateAPI, loadList, deleteAPI } from "../../services/request";
import apiLinks from "../../global/apiLinks";
import { formatDate } from "../../helper/DateConversion";

// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 PRO React
import MDButton from "../../components/MDButton";
import DashboardLayout from "../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../components/Navbars/DashboardNavbar";
// import Footer from "../components/Footer";
import EventCalendar from "../components/Calendar";

// Calendar application components
import ListSchedule from "./components/ListSchedule";
// import ListScheduleItem from "./components/ListSchedule/ListScheduleItem";
import EventEditor from "./event_sidebar_editor";

// import loggedUser from "global/loggedUser";

// import EventsCalendar from "elpa/upcoming_events/calendar";

function UpcomingEvents() {
  const calendarComponentRef = React.createRef();

  const [isLoading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [editorIsOpened, setEditorIsOpened] = useState(false);

  const [selectedEventDetails, setSelectedEventDetails] = useState({});
  const [isEventEditorEditMode, setIsEventEditorEditMode] = useState(false);

  const FAfterLoadAllEvents = ({ data: { response = [] } = {} }) => {
    setAllEvents(response);
    setLoading(false);
  };

  const loadAllEvents = () => {
    setLoading(true);
    loadList(apiLinks.loadAllEvents, FAfterLoadAllEvents);
  };

  const FAfterUpdateSaveEvents = () => {
    setEditorIsOpened(false);
    loadAllEvents();
  };

  const deleteSelectedEvent = (id) => {
    deleteAPI(apiLinks.deleteEvent, id, loadAllEvents);
  };

  const updateEvent = (payload) => {
    updateAPI(apiLinks.updateEvent, selectedEventDetails.id, payload, FAfterUpdateSaveEvents);
  };

  const createEvent = (payload) => {
    createAPI(apiLinks.createEvent, payload, FAfterUpdateSaveEvents);
  };

  useEffect(() => {
    loadAllEvents();
  }, []);

  const FOpenSidebarForAddEvent = () => {
    setIsEventEditorEditMode(false);
    setEditorIsOpened(true);
    setSelectedEventDetails({});
  };

  const CloseEventEditor = () => {
    setIsEventEditorEditMode(false);
    setEditorIsOpened(false);
  };

  const onEditEvent = (event) => {
    setSelectedEventDetails(event);
    setIsEventEditorEditMode(true);
    setEditorIsOpened(true);
  };

  const onDeleteEvent = (event) => {
    deleteSelectedEvent(event.id);
  };

  const handleEventSaveAndUpdate = (event) => {
    const { startTime, endTime, startDate, endDate, ...rest } = event;

    const payload = {
      ...rest,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };

    if (isEventEditorEditMode) {
      updateEvent(payload);
    } else {
      createEvent(payload);
    }
  };

  const handleDateClick = (date) => {
    setSelectedEventDetails({
      startDate: date.dateStr,
    });
    setEditorIsOpened(true);
  };

  const handleEventClick = (data) => {
    setSelectedEventDetails(data.event.extendedProps);
    setEditorIsOpened(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3}>
        {editorIsOpened && (
          <EventEditor
            isEventEditorEditMode={isEventEditorEditMode}
            event={selectedEventDetails}
            editorIsOpened={editorIsOpened}
            CloseEventEditor={CloseEventEditor}
            SaveTheEvent={handleEventSaveAndUpdate}
          />
        )}
        <MDBox display="flex" justifyContent="flex-end" mt={1} mb={4} mx={2}>
          <MDButton variant="gradient" color="info" onClick={FOpenSidebarForAddEvent}>
            <Icon>event</Icon>
            <MDTypography margin color="white" fontSize={14} fontWeight="bold">
              Add Event
            </MDTypography>
          </MDButton>
        </MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={9} sx={{ height: "max-content" }}>
            {useMemo(
              () => (
                <EventCalendar
                  initialView="dayGridMonth"
                  initialDate={new Date()}
                  events={allEvents}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  selectable
                  editable
                  calendarComponentRef={calendarComponentRef}
                />
              ),
              [allEvents]
            )}
            {/* <EventsCalendar details={{calendarEventsData:calendarEventsData, eventsInitialDate:eventsInitialDate}} /> */}
          </Grid>
          <Grid item xs={12} xl={3}>
            <MDBox mb={3}>
              <ListSchedule
                isLoading={isLoading}
                scheduleList={allEvents}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default UpcomingEvents;
