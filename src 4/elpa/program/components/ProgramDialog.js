/* eslint-disable react/prop-types */
import { useState } from "react";
import { Card, Grid } from "@mui/material";
import moment from "moment";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Dialog from "elpa/components/Dialog";
import MDDatePicker from "components/MDDatePicker";
import MDEditor from "components/MDEditor";

function ProgramDialog({ isLoading, item, onCancel, onCreate, isEditMode }) {
  const [values, setValues] = useState({
    title: item?.title || "",
    duration: item?.duration || "",
    description: item?.description || "",
    contactPerson: item?.contactPerson || "",
    startDate: item?.startDate
      ? new Date(moment(item?.startDate, "YYYY-MM-DD").toISOString())
      : new Date(),
  });
  const [errors, setErrors] = useState({});

  const handleOnCreate = () => {
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      if (values[key].trim?.().length === 0) {
        newErrors[key] = "This field is required";
      }
    });

    if (newErrors.title || newErrors.description || newErrors.duration || newErrors.contactPerson) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...values,
      startDate: moment(values.startDate).format("DD-MM-YYYY"),
    };
    onCreate(payload);
  };

  const onChangeInput = ({ target }) => {
    if (errors[target.name]) {
      setErrors((s) => ({
        ...s,
        [target.name]: null,
      }));
    }
    setValues((oldState) => ({
      ...oldState,
      [target.name]: target.value,
    }));
  };

  const onChangeStartDate = ([date]) => {
    setValues((oldState) => ({
      ...oldState,
      startDate: date,
    }));
  };

  const onChangeDescription = (val) => {
    if (errors.description) {
      setErrors((s) => ({
        ...s,
        description: null,
      }));
    }
    setValues((oldState) => ({
      ...oldState,
      description: val,
    }));
  };

  const renderError = (key) => {
    if (errors[key]) {
      return (
        <MDTypography component="p" variant="button" color="error" mt={0.5}>
          {errors[key]}
        </MDTypography>
      );
    }
    return null;
  };

  const renderInput = (keyName, label) => (
    <>
      <MDInput
        value={values[keyName]}
        onChange={onChangeInput}
        fullWidth
        name={keyName}
        label={label}
        error={!!errors[keyName]}
        inputProps={{ type: "text", autoComplete: "" }}
      />
      {renderError(keyName)}
    </>
  );

  return (
    <Dialog open>
      <Card sx={{ width: 768 }}>
        <MDBox p={3}>
          <MDTypography variant="h5">
            {isEditMode ? "Update Program" : "Create New Program"}
          </MDTypography>
        </MDBox>
        <MDBox
          component="form"
          pb={3}
          px={3}
          width="100%"
          sx={{ overflowY: "auto", maxHeight: "80vh" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {renderInput("title", "Title")}
            </Grid>

            <Grid item xs={12} md={12} mt={-2}>
              <MDBox lineHeight={0} display="inline-block">
                <MDTypography component="label" variant="button" fontWeight="regular" color="text">
                  Description&nbsp;&nbsp;
                </MDTypography>
              </MDBox>
              <MDEditor
                value={values.description}
                onChange={onChangeDescription}
                placeholder="Enter program description"
              />
              {renderError("description")}
            </Grid>
            <Grid container spacing={2} mt={1} ml={1}>
              <Grid item xs={6} md={6}>
                {renderInput("duration", "Duration")}
              </Grid>
              <Grid item xs={6} md={6}>
                <MDDatePicker
                  style={{ width: "100%" }}
                  fullWidth
                  input={{
                    label: "Start Date",
                    autoComplete: "",
                    placeholder: "Enter Date",
                  }}
                  value={values.startDate}
                  onChange={onChangeStartDate}
                />
                {renderError("startDate")}
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              {renderInput("contactPerson", "Contact")}
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
                  : `${isLoading ? "Creating..." : "Create"}`}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </Dialog>
  );
}

ProgramDialog.defaultProps = {
  item: {
    title: "",
    startDate: new Date(),
    duration: "",
    description: "",
  },
};

export default ProgramDialog;
