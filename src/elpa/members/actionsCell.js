/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
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

// prop-types is a library for typechecking of props
import { useState } from "react";
// import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";

// eslint-disable-next-line prettier/prettier
function MemberActionsCell({ memberId, openUserEditor, deleteMember, chatMember }) {
  const [menu, setMenu] = useState(null);

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const editMemberClick = () => {
    openUserEditor(memberId);
    closeMenu();
  };

  const deleteMemberClick = () => {
    deleteMember(memberId);
    closeMenu();
  };

  const chatMemberClick = () => {
    chatMember(memberId);
  };

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={editMemberClick} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Icon>edit</Icon> Edit
      </MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem onClick={deleteMemberClick}>
        <MDTypography
          variant="button"
          color="error"
          fontWeight="regular"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Icon>delete_outlined</Icon> Delete
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  return (
    <MDBox display="flex" alignItems="center">
      <MDButton variant={menu ? "text" : "text"} color="dark" iconOnly onClick={openMenu}>
        <Icon>more_horiz</Icon>
      </MDButton>
      {renderMenu}
      <MDButton variant="text" color="dark" iconOnly onClick={chatMemberClick}>
        <Icon>comment</Icon>
      </MDButton>
    </MDBox>
  );
}

// Setting default value for the props of MemberActionsCell
MemberActionsCell.defaultProps = {
  /* image: "",
  color: "dark", */
  memberId: 0,
};

export default MemberActionsCell;
