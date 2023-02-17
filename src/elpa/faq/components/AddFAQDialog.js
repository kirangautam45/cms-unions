/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Grid } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Dialog from "elpa/components/Dialog";
import apiLinks from "global/apiLinks";
import { post, createAPI } from "services/request";

function AddFAQDialog({ isOpen, onClose, isEdit, selectedCategoryId, faqItem }) {
  const [values, setValues] = useState({
    title: "",
    description: "",
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [errors, setErrors] = useState({});

  const onChangeInput = ({ target }) => {
    setValues((s) => ({ ...s, [target.name]: target.value }));
  };

  const onSubmitFAQ = async () => {
    const newErrors = {};
    ["title", "description"].forEach((key) => {
      if (values[key].trim?.().length === 0) {
        newErrors[key] = "This field is required";
      }
    });

    if (newErrors.title || newErrors.description) {
      setErrors(newErrors);
      return;
    }
    setIsRequesting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        categoryId: selectedCategoryId,
      };

      if (isEdit) {
        await post(apiLinks.updateFAQById(faqItem.id), payload);
        setIsRequesting(false);
        onClose(true);
      } else {
        createAPI(apiLinks.createFAQ, payload, () => {
          setIsRequesting(false);
          onClose(true);
        });
      }
    } catch (error) {
      console.log(error);
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    if (faqItem) {
      setValues({ ...faqItem });
    }
  }, [faqItem]);

  useEffect(() => {
    if (!isOpen) {
      setValues({
        title: "",
        description: "",
      });
    }
  }, [isOpen]);

  const onCancelClick = () => {
    onClose(false);
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
    <Grid item xs={12} md={12}>
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
    </Grid>
  );

  return (
    <Dialog open={isOpen}>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">{isEdit ? "Edit FAQ" : "Create New FAQ"}</MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3} width={448}>
          <Grid container spacing={3}>
            {renderInput("title", "Title")}
            {renderInput("description", "Description")}
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
                onClick={onCancelClick}
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
                disabled={isRequesting}
                onClick={onSubmitFAQ}
              >
                {isRequesting ? "Saving..." : isEdit ? "Update" : "Create"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </Dialog>
  );
}

AddFAQDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isEdit: PropTypes.bool,
  faqItem: PropTypes.object,
  selectedCategoryId: PropTypes.string.isRequired,
};

AddFAQDialog.defaultProps = {
  isOpen: false,
  onClose: () => {},
  isEdit: false,
  faqItem: null,
};

export default AddFAQDialog;
