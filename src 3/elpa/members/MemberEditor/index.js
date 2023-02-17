/* eslint-disable prefer-destructuring */
/* eslint-disable no-constant-condition */
/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import moment from "moment";

import apiLinks from "../../../global/apiLinks";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDInput from "../../../components/MDInput";
import MDDatePicker from "../../../components/MDDatePicker";
import { postWithToken, putWithToken } from "../../../services/request";

function MemberEditor({
  id,
  memberEditorType,
  statusClass,
  user,
  closeModalForEditor,
  reloadTheMembersAfterEdit,
}) {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    paid: false,
    membershipStart: new Date().toISOString(),
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setFormValues({ ...user });
    }
  }, [user]);

  const fAfterCreateOrUpdateUser = () => {
    closeModalForEditor();
    reloadTheMembersAfterEdit();
  };

  const saveTheData = async () => {
    setErrorMsg(null);
    const detailsForSave = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      membershipStart: formValues.membershipStart,
      isPaid: formValues.paid,
      isPlayer: false,
      isRepresentative: false,
    };
    try {
      const endpoint = user ? `${apiLinks.updateUser}${user.id}` : apiLinks.createUser;
      await postWithToken(endpoint, detailsForSave);
      fAfterCreateOrUpdateUser();
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message || "Something went wrong!");
    }
  };

  const onChangeInput = (e) => {
    setFormValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onChangeDate = ([date]) => {
    console.log(date);
    setFormValues((s) => ({
      ...s,
      membershipStart: moment(date).toISOString(),
    }));
  };

  const onChangePaid = () => {
    setFormValues((s) => ({
      ...s,
      paid: !s.paid,
    }));
  };

  const renderInput = (fieldName, label) => (
    <Grid item xs={12}>
      <MDInput
        fullWidth
        name={fieldName}
        label={label}
        value={formValues[fieldName]}
        onChange={onChangeInput}
        inputProps={{ type: "text", autoComplete: "" }}
      />
    </Grid>
  );

  return (
    <div className={`MemberEditor ${statusClass}`} id={id}>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">
            {memberEditorType === "editor" ? "Update Existing Member" : "Create New Member"}
          </MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3}>
          <Grid container spacing={3}>
            {errorMsg && (
              <Grid item xs={12}>
                <MDBox py={1} display="flex" justifyContent="center">
                  <MDTypography variant="button" fontWeight="regular" color="error">
                    {errorMsg}
                  </MDTypography>
                </MDBox>
              </Grid>
            )}
            {renderInput("firstName", "First Name")}
            {renderInput("lastName", "Last Name")}
            <Grid item xs={12}>
              <MDDatePicker
                style={{ width: "100%" }}
                fullWidth
                input={{
                  label: "Membership Start Date",
                  autoComplete: "",
                  placeholder: "Enter Date",
                  value: formValues.membershipStart
                    ? moment(formValues.membershipStart).format("MMM DD, YYYY")
                    : "",
                }}
                onChange={onChangeDate}
              />
            </Grid>
            <Grid item xs={12}>
              <MDBox display="flex" alignItems="center">
                <MDBox mt={0.5}>
                  <Switch checked={formValues.paid} onChange={onChangePaid} />
                </MDBox>
                <MDBox width="80%" ml={0.5}>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    {formValues.paid ? `Member is Paid` : `Member is Not Paid`}
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
                onClick={closeModalForEditor}
              >
                Cancel
              </MDButton>
            </MDBox>
            <MDBox ml={2}>
              <MDButton variant="gradient" color="dark" size="small" ml={1} onClick={saveTheData}>
                {memberEditorType === "editor" ? "Update" : "Create"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </div>
  );
}

MemberEditor.propTypes = {
  memberEditorType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default MemberEditor;
