/* eslint-disable object-shorthand */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import { useState } from "react";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";

import timezones from "../../global/timezones.json";

import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
// import Tooltip from "@mui/material/Tooltip";
// import Icon from "@mui/material/Icon";
import MDDropzone from "../../components/MDDropzone";
import MDDatePicker from "../../components/MDDatePicker";
import MDInput from "../../components/MDInput";
import FormField from "../components/layouts/pages/account/components/FormField";
import MDButton from "../../components/MDButton";

// Images
// import team2 from "./assets/images/team-2.jpg";

function EventEditor({
  editorIsOpened,
  CloseEventEditor,
  SaveTheEvent,
  event,
  isEventEditorEditMode,
}) {
  const formattedStartDate = event.startDate?.includes("T")
    ? event.startDate.split("T")[0]
    : event.startDate;

  const [isPrivate, setIsPrivate] = useState(event.isPrivate || false);
  const [isFree, setIsFree] = useState(event.isFree || false);
  const [title, setTitle] = useState(event.title || "");
  const [timeZone, setTimeZone] = useState(event.timeZone || "");
  const [description, setDescription] = useState(event.description || "");
  const [startDate, setStartDate] = useState(formattedStartDate || "");
  const [endDate, setEndDate] = useState(event.endDate?.split("T")[0] || "");
  const [startTime, setStartTime] = useState(event.startTime || "");
  const [endTime, setEndTime] = useState(event.endTime || "");
  // const [tags, setTags] = useState("");

  const [addTimeToTheDate, setAddTimeToTheDate] = useState(false);

  const eventData = () => {
    return {
      isPrivate: isPrivate,
      isFree: isFree,
      // color: //
      // addTimeToTheDate: addTimeToTheDate,
      title: title,
      timeZone: timeZone,
      description: description,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      // tags: tags,
    };
  };

  const timezonesarray = [{ value: "", text: "Select TimeZone" }, ...timezones];
  /* 
  console.log("timezonesarray:", timezonesarray);
  const timezoneoptions = timezonesarray.map((row, i) => {
    return (<option value={row.text} kye={`timezoneoption-${i}`}>{row.text}</option>);
  });
  console.log("timezoneoptions:", timezoneoptions); */
  /* const timezoneoptions = timezonesarray.map((row, i) => {
    // eslint-disable-next-line react/no-array-index-key
    return ( <option key={`timezoneoption-${i}`} value={row.value}>{row.text}</option> );
  }); */
  const timezonesarrayFor = timezonesarray.map((row) => {
    // eslint-disable-next-line react/no-array-index-key
    return row.text;
  });
  const timezonesarrayForfinal = ["", ...timezonesarrayFor];

  const formatDate = (date) => {
    const [dd, mm, yyyy] = date.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className={editorIsOpened ? "EventEditor opened" : "EventEditor"}>
      <div>
        <MDBox>
          <MDTypography variant="h5">
            {" "}
            {isEventEditorEditMode ? "Update Event" : "Create New Event"}
          </MDTypography>
        </MDBox>
        <Divider />
        <MDBox position="relative" height="max-content" mx="auto">
          <MDDropzone options={{ addRemoveLinks: true }} />
        </MDBox>
        <Divider />
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              The Event Is Private
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch checked={isFree} onChange={() => setIsFree(!isFree)} />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              The Event Is Free
            </MDTypography>
          </MDBox>
        </MDBox>
        <Divider />
        <MDBox mb={3}>
          <MDInput
            fullWidth
            label="Event Name"
            inputProps={{ type: "text", autoComplete: "", value: title }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </MDBox>
        <div style={{ position: "relative" }}>
          <MDBox mb={3}>
            {/*
              <MDInput
                fullWidth
                label="Time Zone"
                inputProps={{ type: "text", autoComplete: "" }}
                onChange={()=>{console.log("on Change");}}
              />
            <select onChange={()=>{}}>{timezoneoptions}</select>
              */}

            <Autocomplete
              onChange={(e, values) => {
                setTimeZone(values);
              }}
              defaultValue={timeZone}
              options={timezonesarrayForfinal}
              renderInput={(params) => (
                <FormField {...params} label="Time Zone" InputLabelProps={{ shrink: true }} />
              )}
            />
          </MDBox>
        </div>
        <MDBox mb={3}>
          <MDInput
            fullWidth
            label="Description"
            multiline
            rows={5}
            inputProps={{ type: "text", autoComplete: "", value: description }}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </MDBox>

        <Divider />
        {/* i was trying to add date picker, but it have problems in hidden screns */}
        <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDDatePicker
              fullWidth
              input={{
                label: "Start Date",
                autoComplete: "",
                placeholder: "Select start date",
                value: startDate?.split(",")[0],
              }}
              onChange={([date]) => {
                setStartDate(formatDate(new Date(date).toLocaleDateString()));
              }}
            />
          </MDBox>
          <MDBox>
            <MDDatePicker
              fullWidth
              input={{
                label: "End Date",
                placeholder: "Select end date",
                autoComplete: "",
                value: endDate?.split(",")[0] || "",
              }}
              onChange={([date]) => {
                setEndDate(formatDate(new Date(date).toLocaleDateString()));
              }}
            />
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={3} ml={-1.5}>
          <MDBox mt={0.5}>
            <Switch
              checked={addTimeToTheDate}
              onChange={() => setAddTimeToTheDate(!addTimeToTheDate)}
            />
          </MDBox>
          <MDBox width="80%" ml={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              Add Time to the Date
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox
          style={!addTimeToTheDate ? { display: "none" } : {}}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox>
            <MDInput
              fullWidth
              label="Start Time"
              inputProps={{ type: "time", autoComplete: "" }}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
          </MDBox>
          <MDBox>
            <MDInput
              fullWidth
              label="End Time"
              inputProps={{ type: "time", autoComplete: "" }}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
          </MDBox>
        </MDBox>

        <Divider />

        {/* <MDBox>
          <Autocomplete
            onChange={(e, value) => {
              setTags(value);
            }}
            multiple
            defaultValue={["basketball", "football"]}
            options={["basketball", "football", "handball", "pingpong", "tenis"]}
            renderInput={(params) => <FormField {...params} InputLabelProps={{ shrink: true }} />}
          />
        </MDBox> */}

        <MDBox display="flex" alignItems="center" justifyContent="flex-end" pt={3} pb={5}>
          <MDButton
            variant="contained"
            color="secondary"
            onClick={() => {
              CloseEventEditor();
            }}
          >
            cancel
          </MDButton>
          <MDBox ml={{ xs: 0, sm: 1 }} mt={{ xs: 1, sm: 0 }}>
            <MDButton
              variant="contained"
              color="primary"
              sx={{ height: "100%" }}
              onClick={() => {
                SaveTheEvent(eventData());
              }}
            >
              {isEventEditorEditMode ? "update event" : "create event"}
            </MDButton>
          </MDBox>
        </MDBox>
      </div>
    </div>
  );
}
export default EventEditor;
