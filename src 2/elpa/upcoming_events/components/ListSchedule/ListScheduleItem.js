/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
import { useState } from "react";

import Icon from "@mui/material/Icon";
import EventBusy from "@mui/icons-material/EventBusy";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Moment from "moment";

import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
// import MDBadge from "../../../../components/MDBadge";

// import Tooltip from "@mui/material/Tooltip";
import MDButton from "../../../../components/MDButton";

import basketball from "../../../../assets/images/basketball.jpg";

function ListScheduleItem({ event, onEdit, onDelete }) {
  const [menu, setMenu] = useState(null);
  const openMenu = (e) => setMenu(e.currentTarget);
  const closeMenu = () => setMenu(null);

  const menuItemBenefits = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem
        onClick={() => {
          onEdit(event);
          closeMenu();
        }}
      >
        <Icon>edit</Icon>&nbsp;Edit
      </MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem
        onClick={() => {
          onDelete(event);
          closeMenu();
        }}
      >
        <EventBusy color="error" />
        <MDTypography variant="button" color="error" fontWeight="regular">
          &nbsp;Delete
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={0}>
          <MDBox
            component="img"
            src={event.image || basketball}
            alt="master card"
            width="50px"
            mr={2}
          />
          <MDBox display="flex" flexGrow="1" justifyContent="flex-start" alignItems="center">
            <MDBox display="flex" justifyContent="center" flexDirection="column">
              <MDTypography variant="h6" fontWeight="medium">
                {event.title}
              </MDTypography>
              <MDBox>
                <MDTypography variant="body2" fontWeight="regular">
                  <Icon>calendar_today</Icon> &nbsp; {Moment(event.startDate).format("MMMM, D Y")}
                </MDTypography>
              </MDBox>
            </MDBox>

            {/* <MDBadge variant="contained" color="secondary" badgeContent="Basketball" container />{" "} */}
            <MDBox ml="auto" lineHeight={0}>
              <MDButton variant="text" color="secondary" size="medium" iconOnly onClick={openMenu}>
                <Icon sx={{ cursor: "pointer" }}>more_vert</Icon>
              </MDButton>
              {menuItemBenefits}
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </div>
  );
}
export default ListScheduleItem;
