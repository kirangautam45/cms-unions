/* eslint-disable react/prop-types */
import { useState } from "react";
import Dialog from "elpa/components/Dialog";
import MDBox from "components/MDBox";
import Switch from "@mui/material/Switch";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

function AddEditBenefits({ isEditMode, data, onSave, onCancel, isLoading }) {
  const [title, setTitle] = useState(data?.title || "");
  const [description, setDescription] = useState(data?.description || "");
  const [active, setActive] = useState(data?.active || false);

  return (
    <Dialog open>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">
            {isEditMode ? "Update Existing Benefit" : "Create New Benefit"}
          </MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDInput
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
                label="Title"
                inputProps={{ type: "text", autoComplete: "", value: title }}
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                fullWidth
                label="Description"
                multiline
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                inputProps={{ type: "text", autoComplete: "", value: description }}
              />
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" alignItems="center">
                <MDBox mt={0.5}>
                  <Switch
                    checked={active}
                    onChange={() => {
                      setActive(!active);
                    }}
                  />
                </MDBox>
                <MDBox width="80%" ml={0.5}>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    Activate
                  </MDTypography>
                </MDBox>
              </MDBox>
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
                onClick={() => onSave({ ...data, title, description, active })}
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

export default AddEditBenefits;
