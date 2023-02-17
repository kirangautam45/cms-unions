/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
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

// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// import Tooltip from "@mui/material/Tooltip";
// import Icon from "@mui/material/Icon";
// import Divider from "@mui/material/Divider";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// import masterCardLogo from "../../../../assets/images/logos/mastercard.png";
// import basketball from "../../../../assets/images/basketball.jpg";
import ListScheduleItem from "./ListScheduleItem";

function ListSchedule({ scheduleList, onEdit, onDelete, isLoading }) {
  // const { borderWidth, borderColor } = borders;

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <MDBox p={2}>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              List Schedule
            </MDTypography>
          </MDBox>

          <MDBox display="flex" justifyContent="center">
            <CircularProgress size={30} color="primary" />
          </MDBox>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox p={2}>
        <MDBox>
          <MDTypography variant="h6" fontWeight="medium">
            List Schedule
          </MDTypography>
        </MDBox>

        {scheduleList.length ? (
          scheduleList.map((event) => (
            <ListScheduleItem
              onEdit={onEdit}
              onDelete={onDelete}
              event={event}
              key={`ScheduleEventItem-${event.id}`}
            />
          ))
        ) : (
          // eslint-disable-next-line react/jsx-curly-brace-presence
          <MDTypography variant="body2">{"You haven't created any event yet"}</MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

export default ListSchedule;
