/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { useState } from "react";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";

// eslint-disable-next-line prettier/prettier
function MemberActionsCell({ data, onEdit, onDelete }) {
  const [menu, setMenu] = useState(null);
  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
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
          closeMenu();
          onEdit(data);
        }}
      >
        <MDBox display="flex" alignItems="center">
          <Icon
            style={{
              marginRight: "8px",
            }}
          >
            edit
          </Icon>
          <MDTypography variant="button" fontWeight="regular">
            Edit
          </MDTypography>
        </MDBox>
      </MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem
        onClick={() => {
          closeMenu();
          onDelete(data);
        }}
      >
        <MDBox display="flex" alignItems="center">
          <Icon
            style={{
              marginRight: "8px",
            }}
            color="error"
          >
            person_remove
          </Icon>
          <MDTypography variant="button" color="error" fontWeight="regular">
            Delete
          </MDTypography>
        </MDBox>
      </MenuItem>
    </Menu>
  );

  return (
    <MDBox display="flex" alignItems="center">
      <MDButton variant={menu ? "text" : "text"} color="dark" iconOnly onClick={openMenu}>
        <Icon>more_horiz</Icon>
      </MDButton>
      {renderMenu}
    </MDBox>
  );
}

export default MemberActionsCell;
