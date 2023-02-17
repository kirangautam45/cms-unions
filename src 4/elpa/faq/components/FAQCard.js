import { useState } from "react";
import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Collapse from "@mui/material/Collapse";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function FAQCard({ item, onEdit, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails((s) => !s);
  };

  const onEditClick = () => {
    onEdit(item);
  };

  const onDeleteClick = () => {
    onDelete(item);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <MDBox p={1.5}>
        <MDBox display="flex" alignItems="center" justifyContent="space-between">
          <MDBox lineHeight={0}>
            <MDTypography variant="h6" textTransform="capitalize" fontWeight="regular">
              {item.title}
            </MDTypography>
          </MDBox>
          <Icon
            onClick={toggleShowDetails}
            fontSize="default"
            color="warning"
            sx={{
              cursor: "pointer",
              transform: `rotate(${showDetails ? 90 : 0}deg)`,
              transition: "all 0.3s",
            }}
          >
            keyboard_double_arrow_right
          </Icon>
        </MDBox>
        <Collapse in={showDetails} unmountOnExit mountOnEnter>
          <MDBox lineHeight={1}>
            <MDTypography
              component="div"
              variant="button"
              fontWeight="light"
              color="text"
              textAlign="justify"
              my={1}
            >
              {item.description}
            </MDTypography>
            <MDBox display="flex" justifyContent="flex-end" alignItems="center">
              <Icon
                fontSize="small"
                color="secondary"
                onClick={onEditClick}
                sx={{ cursor: "pointer" }}
              >
                edit
              </Icon>
              <Icon
                onClick={onDeleteClick}
                fontSize="small"
                color="secondary"
                sx={{ cursor: "pointer" }}
              >
                delete
              </Icon>
            </MDBox>
          </MDBox>
        </Collapse>
      </MDBox>
    </Card>
  );
}

FAQCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
};

// Typechecking props for the FAQCard
FAQCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categoryId: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default FAQCard;
