import { Icon } from "@mui/material";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CardStyled from "./CardStyled";

function CategoryCard({ data, onEdit, onDelete }) {
  const handleEdit = async () => {
    onEdit(data);
  };

  const handleDelete = () => {
    onDelete(data);
  };

  const numFaq = data.numOfFaq || 0;

  return (
    <CardStyled>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="p" color="secondary" fontWeight="bold" fontSize="small">
          {data.unionProvider}
        </MDTypography>
        <MDTypography variant="text" color="secondary" fontWeight="light" sx={{ fontSize: 14 }}>
          {moment(data.createdAt).format("MMM DD, YYYY")}
        </MDTypography>
      </MDBox>
      <MDTypography
        variant="h5"
        color="secondary"
        fontWeight="bold"
        to={`/elpa/faq/${data.id}`}
        component={Link}
      >
        {data.name}
      </MDTypography>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography
          variant="text"
          color="secondary"
          fontWeight="regular"
          sx={{
            fontSize: 14,
          }}
        >
          {numFaq} {numFaq > 1 ? "faqs" : "faq"}
        </MDTypography>
        <MDBox display="flex" alignItems="center" gap={1} className="actions">
          <Icon fontSize="small" color="secondary" onClick={handleEdit} sx={{ cursor: "pointer" }}>
            edit
          </Icon>
          <Icon
            onClick={handleDelete}
            fontSize="small"
            color="secondary"
            sx={{ cursor: "pointer" }}
          >
            delete
          </Icon>
        </MDBox>
      </MDBox>
    </CardStyled>
  );
}

CategoryCard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    createdAt: PropTypes.string,
    name: PropTypes.string,
    serviceProvider: PropTypes.string,
    unionProvider: PropTypes.string,
    numOfFaq: PropTypes.number,
  }).isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

CategoryCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
};

export default CategoryCard;
