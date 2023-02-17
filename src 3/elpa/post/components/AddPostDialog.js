/* eslint-disable react/forbid-prop-types */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Grid } from "@mui/material";

import MDBox from "components/MDBox";
import MDEditor from "components/MDEditor";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Dialog from "elpa/components/Dialog";
import { post, postUploadImage } from "services/request";

import UploadDialog from "./UploadDialog";
import SelectTopic from "./SelectTopic";
import ShowPreviewDialog from "./ShowPreviewDialog";

const defaultValues = {
  topicId: "",
  image: null,
  title: "",
  description: "",
};

function AddPostDialog({ isOpen, onClose, selectedPost, topics, forceUpdate }) {
  const [values, setValues] = useState({ ...defaultValues });
  const [showUpload, setShowUpload] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setAPIError] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const validationValues = () => {
    const err = {};
    Object.keys(values).forEach((key) => {
      if (key !== "image" && values[key].trim().length === 0) {
        err[key] = "This field required";
      }
    });
    setErrors(err);
    return !err.title && !err.description && !err.topicId;
  };

  const submitPost = async (data) => {
    if (validationValues()) {
      const payload = {
        title: values.title,
        text: values.description,
        tags: [],
        isPublishedToForum: false,
        ...data,
      };
      setIsRequesting(true);
      setAPIError(null);

      let postId = selectedPost?.id;
      let errorMsg = null;
      try {
        if (selectedPost) {
          payload.topicId = values.topicId;
          await post(`union/posts/update/${selectedPost.id}`, payload);
        } else {
          const { data: postData } = await post(`union/posts/create/${values.topicId}`, payload);
          postId = postData.id;
        }

        if (values.image) {
          try {
            const formData = new FormData();
            formData.append("multipartFile", values.image);
            await postUploadImage(`union/posts/add/image/${postId}`, formData);
          } catch (error) {
            errorMsg = "Can not upload image!!!";
          }
        }
        if (!errorMsg) {
          onClose();
        }
      } catch (error) {
        console.log(error);
        setAPIError(error.message || "Something went wrong!");
      }
      // eslint-disable-next-line no-unused-expressions
      errorMsg && setAPIError(errorMsg);
      forceUpdate();
      setIsRequesting(false);
    }
  };

  const publishPost = () => {
    submitPost({
      isPublished: true,
      isTrashed: false,
      isDraft: false,
    });
  };

  const toggleReview = () => {
    if (validationValues()) {
      setShowPreview(!showPreview);
    }
  };

  const saveAsDraft = () => {
    submitPost({
      isPublished: false,
      isTrashed: false,
      isDraft: true,
    });
  };

  const toggleUploadImageDialog = () => {
    setShowUpload(!showUpload);
  };

  const onSelectFile = (file) => {
    setValues((s) => ({
      ...s,
      image: file,
    }));
  };

  const onChangeInput = ({ target }) => {
    if (errors[target.name]) {
      setErrors((s) => ({
        ...s,
        [target.name]: null,
      }));
    }
    setValues((s) => ({ ...s, [target.name]: target.value }));
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

  const onChangeTopic = (id) => {
    setValues({ ...values, topicId: id });
    if (errors.topicId) {
      setErrors((s) => ({
        ...s,
        topicId: null,
      }));
    }
  };

  useEffect(() => {
    if (selectedPost) {
      setValues({
        topicId: selectedPost.topicId,
        image: null,
        title: selectedPost.title,
        description: selectedPost.text,
      });
    }
  }, [selectedPost]);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setAPIError(null);
      setValues({ ...defaultValues });
    }
  }, [isOpen]);

  return (
    <>
      <UploadDialog
        isOpen={showUpload}
        onClose={toggleUploadImageDialog}
        onSelectFile={onSelectFile}
      />
      <ShowPreviewDialog
        isOpen={showPreview}
        onClose={toggleReview}
        post={{ title: values.title, text: values.description, image: values.image?.dataURL }}
      />
      <Dialog open={isOpen && !showUpload && !showPreview}>
        <Card sx={{ width: 768 }}>
          <MDBox p={3}>
            <MDTypography variant="h5">
              {selectedPost ? "Edit This Post" : "Create New Post"}
            </MDTypography>
          </MDBox>
          <MDBox pb={3} px={3} width="100%">
            <Grid container spacing={3}>
              {apiError && (
                <Grid item xs={12} md={12}>
                  <MDBox display="flex" justifyContent="center" py={1}>
                    <MDTypography variant="button" color="error">
                      {apiError}
                    </MDTypography>
                  </MDBox>
                </Grid>
              )}
              <Grid item xs={12} md={12} sx={{ zIndex: 2 }}>
                <SelectTopic topics={topics} value={values.topicId} onChange={onChangeTopic} />
                {renderError("topicId")}
              </Grid>
              <Grid item xs={12} md={12}>
                <MDInput
                  value={values.title}
                  onChange={onChangeInput}
                  fullWidth
                  name="title"
                  label="Title"
                  inputProps={{ type: "text", autoComplete: "" }}
                />
                {renderError("title")}
              </Grid>
              <Grid item xs={12} md={12}>
                <MDEditor
                  value={values.description}
                  onChange={onChangeDescription}
                  placeholder="Enter your text"
                />
                {renderError("description")}
              </Grid>
            </Grid>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              mt={3}
              gap={1}
              pr="10px"
            >
              <MDButton variant="outlined" color="dark" size="small" onClick={onClose}>
                Cancel
              </MDButton>
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDButton variant="outlined" color="dark" size="small" onClick={toggleReview}>
                  Preview post
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="dark"
                  size="small"
                  onClick={saveAsDraft}
                  disabled={isRequesting}
                >
                  Save as draft
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="dark"
                  size="small"
                  onClick={toggleUploadImageDialog}
                >
                  Upload image
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="warning"
                  size="small"
                  onClick={publishPost}
                  disabled={isRequesting}
                >
                  Publish
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </Dialog>
    </>
  );
}

AddPostDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  forceUpdate: PropTypes.func,
  selectedPost: PropTypes.object,
  topics: PropTypes.arrayOf(PropTypes.object),
};

AddPostDialog.defaultProps = {
  isOpen: false,
  onClose: () => {},
  forceUpdate: () => {},
  selectedPost: null,
  topics: [],
};

export default AddPostDialog;
