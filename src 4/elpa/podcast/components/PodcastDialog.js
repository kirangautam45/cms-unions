/* eslint-disable react/prop-types */
import { useState } from "react";
import { Card, Grid } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Dialog from "elpa/components/Dialog";

function PodcastDialog({ isLoading, podcast, onCancel, onCreate, isEditMode }) {
  const [title, setTitle] = useState(podcast?.title || "");
  const [description, setDescription] = useState(podcast?.description || "");
  const [youtubeUrl, setYoutubeUrl] = useState(podcast?.link || "");

  const handleOnCreate = () => {
    const podcastPayload = {
      title,
      description,
      link: youtubeUrl,
    };

    onCreate(podcastPayload);
  };

  return (
    <Dialog open>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">
            {isEditMode ? "Update Podcast" : "Create New Podcast"}
          </MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3} width={448}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <MDInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                label="Title"
                inputProps={{ type: "text", autoComplete: "" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <MDInput
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                label="Description"
                multiline
                rows={5}
                inputProps={{ type: "text", autoComplete: "" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <MDInput
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                fullWidth
                label="Youtube link"
                inputProps={{ type: "text", autoComplete: "" }}
              />
            </Grid>
          </Grid>
          <MDBox
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            pt="28px"
            pr="10px"
          >
            <MDBox>
              <MDButton
                variant="gradient"
                color="secondary"
                size="small"
                mr="10px"
                onClick={onCancel}
              >
                Cancel
              </MDButton>
            </MDBox>
            <MDBox ml={2}>
              <MDButton
                variant="gradient"
                color="dark"
                size="small"
                ml={1}
                onClick={handleOnCreate}
              >
                {isEditMode
                  ? `${isLoading ? "Updating..." : "Update"}`
                  : `${isLoading ? `Creating...` : "Create"}`}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </Dialog>
  );
}

export default PodcastDialog;
