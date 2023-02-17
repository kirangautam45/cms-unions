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

// react-routers components
// import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";

// Material Dashboard 2 PRO React base styles
// import colors from "../../../../../assets/theme/base/colors";
import typography from "../../../../../assets/theme/base/typography";
import MDButton from "../../../../../components/MDButton";
import FormAddEditTEam from "../../../FormAddEditTEam";

const teamLabels = [
  "teamName",
  "teamColors",
  "region",
  "country",
  "league",
  "city",
  "street",
  "address",
];

const labelLinks = [
  { label: "website", icon: <LanguageIcon /> },
  { label: "facebook", icon: <FacebookIcon /> },
  { label: "twitter", icon: <TwitterIcon /> },
];

function ProfileInfoCard(props) {
  const {
    title,
    description,
    // social,
    action,
    shadow,
    data,
    fAfterUpdateTheTeam,
  } = props;
  const [isOpenedEditorModal, setIsOpenedEditorModal] = useState(false);

  const closeFormEditor = () => {
    setIsOpenedEditorModal(false);
  };

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        <MDTypography
          component={MDButton}
          onClick={() => setIsOpenedEditorModal(true)}
          variant="body2"
          color="secondary"
        >
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>
          {teamLabels.map((label) => (
            <MDBox key={`key-${label}`} display="flex" py={1} pr={2}>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {label}: &nbsp;
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{data[label]}
              </MDTypography>
            </MDBox>
          ))}
          <MDBox display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
              Team Name: &nbsp;
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;{data.teamName}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
              social: &nbsp;
            </MDTypography>
            {labelLinks.map((label) =>
              data[label.label] ? (
                <MDBox
                  key={label.label}
                  component="a"
                  href={data[label.label]}
                  target="_blank"
                  rel="noreferrer"
                  fontSize={typography.size.lg}
                  pr={1}
                  pl={0.5}
                  lineHeight={1}
                >
                  {label.icon}
                </MDBox>
              ) : null
            )}
          </MDBox>
        </MDBox>
      </MDBox>

      <FormAddEditTEam
        isForUpdate
        teamEditId={data.id}
        modalIsOpenedProp={isOpenedEditorModal}
        closeFormEditor={closeFormEditor}
        teamDataForUpdate={data}
        fAfterUpdateTheTeam={(updatedData) => {
          fAfterUpdateTheTeam(updatedData);
          setIsOpenedEditorModal(false);
        }}
      />
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  // social: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
