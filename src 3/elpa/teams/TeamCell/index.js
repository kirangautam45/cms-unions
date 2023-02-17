/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
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
// import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";

function TeamCell({ teamId, image, name, league, FAddTheTeam }) {
  return (
    <MDBox display="flex" alignItems="center" pr={2} onClick={()=>{FAddTheTeam(teamId);}} style={{cursor:"pointer"}}>
      <MDBox mr={2}>
        <MDAvatar src={image} alt={name} />
      </MDBox>
      <MDBox display="flex" flexDirection="column">
        <MDTypography variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="secondary">
          <MDTypography component="span" variant="button" fontWeight="regular" color="success">
            {league}
          </MDTypography>
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

export default TeamCell;
