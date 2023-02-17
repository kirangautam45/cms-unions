import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ProgramCard({ item, onEdit, onDelete }) {
  const [menuRef, setMenuRef] = useState(null);

  const onCloseMenu = () => {
    setMenuRef(null);
  };

  const openMenuClick = (event) => {
    setMenuRef(event.currentTarget);
  };

  const onEditClick = () => {
    onEdit(item);
    onCloseMenu();
  };

  const onDeleteClick = () => {
    onDelete(item);
    onCloseMenu();
  };

  const renderMenu = useCallback(
    () => (
      <Menu
        anchorEl={menuRef}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(menuRef)}
        onClose={onCloseMenu}
        keepMounted
      >
        <MenuItem onClick={onEditClick}>
          <Link to={`/elpa/program/${item.id}`}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              View details
            </MDTypography>
          </Link>
        </MenuItem>
        <MenuItem onClick={onEditClick}>Edit</MenuItem>
        <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
      </Menu>
    ),
    [menuRef]
  );

  return (
    <Card sx={{ mb: 3 }}>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center">
          <MDBox lineHeight={0}>
            <Link to={`/elpa/program/${item.id}`}>
              <MDTypography variant="h6" textTransform="capitalize" fontWeight="medium">
                {item.title}
              </MDTypography>
            </Link>
          </MDBox>
          <MDTypography
            color="secondary"
            onClick={openMenuClick}
            sx={{
              ml: "auto",
              mt: 1,
              mr: -1,
              alignSelf: "flex-start",
            }}
          >
            <Icon fontSize="default" sx={{ cursor: "pointer", fontWeight: "bold" }}>
              more_vert
            </Icon>
          </MDTypography>
          {renderMenu()}
        </MDBox>
        <MDBox mt={2} lineHeight={1}>
          <MDTypography
            component="div"
            variant="button"
            fontWeight="light"
            color="text"
            sx={{ position: "relative" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: item.description }}
              className="programDetailsEclips"
            />
          </MDTypography>
          <Divider />
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox display="flex" flexDirection="column" lineHeight={0}>
              <MDTypography variant="button" fontWeight="regular" color="secondary">
                Duration
              </MDTypography>
              <MDTypography variant="button" fontWeight="medium">
                {item.duration || "--"}
              </MDTypography>
            </MDBox>
            <MDBox display="flex" flexDirection="column" lineHeight={0}>
              <MDTypography variant="button" fontWeight="regular" color="secondary">
                Start date
              </MDTypography>
              <MDTypography variant="button" fontWeight="medium">
                {item.startDate || "--"}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

ProgramCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
};

// Typechecking props for the ProgramCard
ProgramCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    duration: PropTypes.string,
    externalProgramInfo: PropTypes.string,
    contactPerson: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ProgramCard;
