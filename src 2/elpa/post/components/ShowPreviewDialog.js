/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import { Card, Tooltip, Icon } from "@mui/material";
import moment from "moment";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Dialog from "elpa/components/Dialog";
import MDButton from "components/MDButton";
import PostCard from "./PostCard";
import booking1 from "../../../assets/images/products/product-1-min.jpg";

function ShowPreviewDialog({ isOpen, onClose, post }) {
  const postsButtons = () => (
    <>
      <Tooltip title="Delete The Post" placement="bottom">
        <MDTypography
          variant="body1"
          color="primary"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
        >
          <Icon color="inherit">delete</Icon>
        </MDTypography>
      </Tooltip>
      <Tooltip title="Edit The Post" placement="bottom">
        <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: "pointer", mx: 3 }}>
          <Icon color="inherit">edit</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  return (
    <Dialog open={isOpen}>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">Preview post</MDTypography>
        </MDBox>
        <MDBox p={4} width="100%">
          <MDBox display="flex" pb={2} justifyContent="center" width="320px">
            <PostCard
              image={post.image || booking1}
              title={post.title}
              description={post.text}
              time={moment().fromNow()}
              location="ELPA"
              action={postsButtons()}
            />
          </MDBox>
          <MDBox
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            pt="10px"
            pr="10px"
          >
            <MDButton variant="gradient" color="secondary" size="small" mr="10px" onClick={onClose}>
              Close
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    </Dialog>
  );
}

ShowPreviewDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  post: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
};

ShowPreviewDialog.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default ShowPreviewDialog;
