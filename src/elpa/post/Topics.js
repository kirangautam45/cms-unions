import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";

import { get } from "services/request";

import DashboardLayout from "elpa/components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "elpa/components/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import SelectedTopic from "./SelectedTopic";
import AddTopicDialog from "./components/AddTopicDialog";
import AddPostDialog from "./components/AddPostDialog";
import CardTopic from "./components/CardTopic";

function Topics() {
  const [openAddTopic, setOpenAddTopic] = useState(false);
  const [openAddPost, setOpenAddPost] = useState(false);
  const [isEditTopic, setIsEditTopic] = useState(false);
  const [fetchNewData, setFetchNewData] = useState(false);
  const { topicId } = useParams();
  const [topics, setTopics] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postResumed, setPostResumed] = useState({
    draft: 0,
    trashed: 0,
    published: 0,
  });

  const loadTheTopics = async () => {
    try {
      const { data } = await get("union/topics/all?page=0&size=50");
      setTopics(data.topics);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickNewTopic = () => {
    setOpenAddTopic(true);
  };

  const onClickNewPost = () => {
    setOpenAddPost(true);
  };

  const onEditPost = (post) => {
    setSelectedPost(post);
    setOpenAddPost(true);
  };

  const renderState = (icon, label, value, color) => (
    <MDButton
      variant="contained"
      color="white"
      disabled
      sx={{
        display: "flex",
        alignItems: "center",
        textTransform: "none",
        opacity: "1 !important",
      }}
    >
      <Icon sx={{ color }}>{icon}</Icon>
      &nbsp;{label} &nbsp;&nbsp;&nbsp;<span style={{ color }}>{postResumed[value]}</span>
    </MDButton>
  );

  const onCloseDialog = () => {
    setOpenAddTopic(false);
    setIsEditTopic(false);
    setFetchNewData(true);
    setOpenAddPost(false);
    setSelectedPost(null);
  };

  const forceUpdate = () => {
    setShouldUpdate(!shouldUpdate);
  };

  useEffect(() => {
    loadTheTopics();
  }, []);

  useEffect(() => {
    if (fetchNewData) {
      loadTheTopics();
      setFetchNewData(false);
    }
  }, [fetchNewData]);

  return (
    <>
      <AddPostDialog
        isOpen={openAddPost}
        onClose={onCloseDialog}
        topics={topics}
        selectedPost={selectedPost}
        forceUpdate={forceUpdate}
      />
      <AddTopicDialog isOpen={openAddTopic} isEdit={isEditTopic} onClose={onCloseDialog} />
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox my={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <MDButton
              variant="contained"
              color="warning"
              onClick={topicId ? onClickNewPost : onClickNewTopic}
              startIcon={<Icon>add_circle</Icon>}
            >
              {topicId ? "Add New Post" : "Add New Topic"}
            </MDButton>
            {!!topicId && (
              <MDBox display="flex" gap={1}>
                {renderState("auto_awesome", "Published", "published", "#6AE082")}
                {renderState("archive", "Draft", "draft", "#60CCD8")}
                {renderState("delete_outlined", "Trashed", "trashed", "#CD2F4E")}
              </MDBox>
            )}
          </MDBox>

          {!topicId ? (
            <MDBox py={1}>
              <Grid container spacing={3}>
                {topics.map((data) => (
                  <Grid item key={data.id}>
                    <CardTopic
                      data={data}
                      callback={() => {
                        setFetchNewData(true);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </MDBox>
          ) : (
            <MDBox p={2}>
              <SelectedTopic
                topicId={topicId}
                setPostResumed={setPostResumed}
                shouldUpdate={shouldUpdate}
                onEdit={onEditPost}
              />
            </MDBox>
          )}
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default Topics;
