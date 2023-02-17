/* eslint-disable react/forbid-prop-types */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Grid } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Dialog from "elpa/components/Dialog";

import { post } from "services/request";

function AddTopicDialog({ isOpen, onClose, isEdit, currentTopic }) {
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (currentTopic) {
      setTopic(currentTopic.title);
    }
  }, [currentTopic]);

  const createTopic = async () => {
    try {
      await post(`union/topics/${isEdit ? `update/${currentTopic.id}` : "create"}`, {
        title: topic,
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen}>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">
            {isEdit ? "Edit This Topic" : "Create New Topic"}
          </MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3} width={448}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <MDInput
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                fullWidth
                label="Please write topic name"
                inputProps={{ type: "text", autoComplete: "" }}
              />
            </Grid>
          </Grid>
          <MDBox
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            pt="10px"
            pr="10px"
          >
            <MDBox>
              <MDButton
                variant="gradient"
                color="secondary"
                size="small"
                mr="10px"
                onClick={onClose}
              >
                Cancel
              </MDButton>
            </MDBox>
            <MDBox ml={2}>
              <MDButton variant="gradient" color="dark" size="small" ml={1} onClick={createTopic}>
                Create
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </Dialog>
  );
}

AddTopicDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isEdit: PropTypes.bool,
  currentTopic: PropTypes.object,
};

AddTopicDialog.defaultProps = {
  isOpen: false,
  onClose: () => {},
  isEdit: false,
  currentTopic: null,
};

export default AddTopicDialog;
