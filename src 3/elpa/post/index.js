import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Link, useParams } from "react-router-dom";

import { get } from "services/request";

import DashboardLayout from "elpa/components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "elpa/components/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

import NoteBookWriteIcon from "assets/icons/notebook-write.svg";
import ListEditIcon from "assets/icons/list-edit.svg";

import SelectedTopic from "./SelectedTopic";
import AddTopicDialog from "./components/AddTopicDialog";
import CardTopic from "./CardTopic";

function ElpaPost() {
  const { topicId } = useParams();
  const [menu, setMenu] = useState(null);
  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => {
    setMenu(null);
  };

  const [openAddTopic, setOpenAddTopic] = useState(false);
  const [isEditTopic, setIsEditTopic] = useState(false);
  const [fetchNewData, setFetchNewData] = useState(false);
  const [totalTopicItems, setTotalTopicItems] = useState(0);

  const [postTopics, setPostTopics] = useState([]);

  const loadTheTopics = async () => {
    const result = await get("union/topics/all?page=0&size=10");
    const { topics, totalItems } = result.data;
    setTotalTopicItems(totalItems);
    const NewLoadedTopics = topics.map((data) => (
      <Grid item key={`postTopic-${data.id}`}>
        <CardTopic
          data={data}
          callback={() => {
            setFetchNewData(true);
          }}
        />
      </Grid>
    ));
    setPostTopics(NewLoadedTopics);
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

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
      style={{ marginTop: "10px" }}
    >
      <MenuItem
        onClick={() => {
          closeMenu();
          setOpenAddTopic(true);
        }}
      >
        <ListItemIcon>
          <img src={NoteBookWriteIcon} alt="create-topic" />
        </ListItemIcon>
        Create Topic
      </MenuItem>
      <MenuItem
        onClick={() => {
          closeMenu();
        }}
      >
        <ListItemIcon>
          <img src={ListEditIcon} alt="create-post" />
        </ListItemIcon>
        Create Post
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AddTopicDialog
        isOpen={openAddTopic}
        isEdit={isEditTopic}
        onClose={() => {
          setOpenAddTopic(false);
          setIsEditTopic(false);
          setFetchNewData(true);
        }}
      />
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox my={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <MDButton variant="contained" color="warning" onClick={openMenu}>
              <Icon>add_circle</Icon>&nbsp;Add New
            </MDButton>
            {renderMenu}
            {!!topicId && (
              <MDBox display="flex">
                <MDButton variant="contained" color="white">
                  <Icon>auto_awesome</Icon>
                  &nbsp;Published &nbsp;&nbsp;&nbsp;52
                </MDButton>
                <MDBox ml={1}>
                  <MDButton variant="contained" color="white">
                    <Icon>archive</Icon>
                    &nbsp;Draft &nbsp;&nbsp;&nbsp;52
                  </MDButton>
                </MDBox>
                <MDBox ml={1}>
                  <MDButton variant="contained" color="white">
                    <Icon>delete</Icon>
                    &nbsp;Trashed &nbsp;&nbsp;&nbsp;52
                  </MDButton>
                </MDBox>
              </MDBox>
            )}
          </MDBox>
          {totalTopicItems > 7 && (
            <MDBox display="flex" alignItems="flex-end" justifyContent="flex-end">
              <MDButton
                size="small"
                variant="text"
                color="secondary"
                to="/elpa/topics"
                component={Link}
              >
                Show More Topic
              </MDButton>
            </MDBox>
          )}

          {!topicId ? (
            <MDBox py={1} style={{ overflowX: "auto" }}>
              <Grid container spacing={3} wrap="wrap">
                {postTopics}
              </Grid>
            </MDBox>
          ) : (
            <MDBox p={2}>
              <SelectedTopic topicId={topicId} />
            </MDBox>
          )}
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default ElpaPost;
