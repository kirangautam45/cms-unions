/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card } from "@mui/material";

import MDBox from "components/MDBox";
import MDDropzone from "components/MDDropzone";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Dialog from "elpa/components/Dialog";

function UploadDialog({ isOpen, onClose, onSelectFile }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [, setRefresh] = useState(false);

  const onAddFile = (file) => {
    setSelectedFile(file);
    setTimeout(() => {
      setRefresh((s) => !s);
    }, 300);
  };

  const onUploadImage = () => {
    if (selectedFile) {
      onSelectFile(selectedFile);
    }
    onClose();
  };

  const onDelete = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    if (!isOpen && selectedFile) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <Card sx={{ width: 768 }}>
        <MDBox p={3}>
          <MDTypography variant="h5">Upload Image</MDTypography>
        </MDBox>
        <MDBox component="div" pb={3} px={3} width="100%">
          {selectedFile ? (
            <MDBox width="100%" height="280px">
              <img
                src={selectedFile.dataURL}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                alt=""
              />
            </MDBox>
          ) : (
            <>
              {isOpen && (
                <MDDropzone
                  options={{
                    addRemoveLinks: true,
                    acceptedFiles: "image/*",
                    maxFiles: 1,
                    uploadMultiple: false,
                    addedfile: onAddFile,
                  }}
                />
              )}
            </>
          )}

          <MDBox
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            flexWrap="wrap"
            mt={3}
            gap={1}
            pr="10px"
          >
            <MDButton variant="outlined" color="dark" size="small" onClick={onClose}>
              Cancel
            </MDButton>
            {selectedFile && (
              <MDButton variant="outlined" color="dark" size="small" onClick={onDelete}>
                Delete Image
              </MDButton>
            )}
            <MDButton variant="gradient" color="warning" size="small" onClick={onUploadImage}>
              Upload image
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    </Dialog>
  );
}

UploadDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSelectFile: PropTypes.func,
};

UploadDialog.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSelectFile: () => {},
};

export default UploadDialog;
