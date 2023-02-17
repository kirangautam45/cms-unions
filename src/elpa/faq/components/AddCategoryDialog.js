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
import { createAPI, updateAPI } from "services/request";

function AddCategoryDialog({ isOpen, onClose, isEdit, currentCategory }) {
  const [categoryName, setCategoryName] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState(null);

  const onChangeCategoryName = (e) => {
    setError(null);
    setCategoryName(e.target.value);
  };

  const apiCallback = () => {
    setIsRequesting(false);
    onClose(true);
  };

  const onCancelClick = () => {
    onClose(false);
  };

  const onSubmitCategory = async () => {
    if (categoryName.trim().length === 0) {
      setError("Category name is required");
      return;
    }

    setIsRequesting(true);
    try {
      if (isEdit) {
        updateAPI(
          apiLinks.updateFAQCategory,
          currentCategory.id,
          { name: categoryName },
          apiCallback
        );
      } else {
        createAPI(apiLinks.createFAQCategory, { name: categoryName }, apiCallback);
      }
    } catch (err) {
      setIsRequesting(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentCategory && isOpen) {
      setCategoryName(currentCategory.name);
    }
    if (!isOpen) {
      setCategoryName("");
    }
  }, [currentCategory, isOpen]);

  return (
    <Dialog open={isOpen}>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">
            {isEdit ? "Edit Category" : "Create New Category"}
          </MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3} width={448}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <MDInput
                value={categoryName}
                onChange={onChangeCategoryName}
                fullWidth
                error={!!error}
                label="Category name"
                inputProps={{ type: "text", autoComplete: "" }}
              />
              {error && (
                <MDTypography component="p" variant="button" color="error" mt={0.5}>
                  {error}
                </MDTypography>
              )}
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
                onClick={onSubmitCategory}
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

AddCategoryDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
};

AddCategoryDialog.defaultProps = {
  isOpen: false,
  onClose: () => {},
  isEdit: false,
  currentCategory: null,
};

export default AddCategoryDialog;
