import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import getVideoId from "get-video-id";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import ReactPlayer from "react-player/youtube";

import CircularProgress from "@mui/material/CircularProgress";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import apiLinks from "../../global/apiLinks";
import { createAPI, deleteAPI, updateAPI, loadList } from "../../services/request";
import MDButton from "../../components/MDButton";
import PodcastCard from "./components/PodcastCard";
import DashboardLayout from "../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../components/Navbars/DashboardNavbar";

import defaultImage from "../../assets/images/podcast.jpeg";

// Overview page components
import Header from "../../app/shared/HeaderInner";
import PodcastDialog from "./components/PodcastDialog";

function Podcast() {
  const [apiState, setApiState] = useState({
    isLoadingPodcast: true,
    isUpdatingPodcast: false,
    isDeletingPodcast: false,
    isCreatingPodcast: false,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 9,
  });

  const [isEditMode, setEditMode] = useState(false);

  const [isVideoPlayerOpen, setVideoPlayerOpen] = useState(false);

  const [isDialogOpen, setDialogOpen] = useState(false);

  const [allPodcast, setAllPodcast] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState({});

  const fAfterPodcastLoaded = ({
    data: { podcast = [], currentPage, totalPages, totalItems } = {},
  }) => {
    setPagination({
      ...pagination,
      currentPage: currentPage || pagination.currentPage,
      totalPages: totalPages || pagination.currentPage,
      totalItems: totalItems || pagination.totalItems,
    });
    const formattedData = podcast.map((item) => ({
      ...item,
      image:
        getVideoId(item?.link || "")?.service === "youtube"
          ? apiLinks.getYoutubeVideoThumbnail(getVideoId(item.link).id)
          : defaultImage,
    }));

    setAllPodcast(formattedData);
    setApiState({
      ...apiState,
      isLoadingPodcast: false,
    });
  };

  const fetchAllPodcast = (value) => {
    setApiState({
      ...apiState,
      isLoadingPodcast: true,
    });
    loadList(
      apiLinks.loadAllPodcast(value || pagination.currentPage, pagination.pageSize),
      fAfterPodcastLoaded
    );
  };

  const fAfterDeletePodcast = () => {
    setApiState({
      ...apiState,
      isDeletingPodcast: false,
    });
    fetchAllPodcast();
  };

  const fAfterCreatePodcast = () => {
    setApiState({
      ...apiState,
      isCreatingPodcast: false,
    });
    setDialogOpen(false);
    fetchAllPodcast();
  };

  const fAfterEditPodcast = () => {
    setApiState({
      ...apiState,
      isUpdatingPodcast: false,
    });

    setDialogOpen(false);
    fetchAllPodcast();
  };

  const deletePodcast = (id) => {
    setApiState({
      ...apiState,
      isDeletingPodcast: true,
    });
    deleteAPI(apiLinks.deletePodcast, id, fAfterDeletePodcast);
  };

  const createPodcast = (podcast) => {
    setApiState({
      ...apiState,
      isCreatingPodcast: true,
    });
    createAPI(apiLinks.createPodcast, podcast, fAfterCreatePodcast);
  };

  useEffect(() => {
    fetchAllPodcast();
  }, []);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleEdit = (podcast) => {
    setEditMode(true);
    handleOpen();
    setSelectedPodcast(podcast);
  };

  const handleDelete = (podcast) => {
    deletePodcast(podcast.id);
  };

  const handleCreate = (podcast) => {
    if (isEditMode) {
      setApiState({
        ...apiState,
        isUpdatingPodcast: true,
      });
      updateAPI(apiLinks.updatePodcast, selectedPodcast.id, podcast, fAfterEditPodcast);
    } else {
      createPodcast(podcast);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditMode(false);
  };

  const handlePagination = (_, value) => {
    setPagination({
      ...pagination,
      currentPage: value,
    });
    fetchAllPodcast(value);
  };

  const closeVideoPlayer = () => {
    setSelectedPodcast({});
    setVideoPlayerOpen(false);
  };

  const handleCardSelect = (podcast) => {
    setSelectedPodcast(podcast);
    setVideoPlayerOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox py={2} px={2} lineHeight={1.25} display="flex" justifyContent="space-between">
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              Podcast
            </MDTypography>
            <MDBox mb={1}>
              <MDTypography variant="button" color="text">
                Podcast for all
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDButton variant="gradient" color="info" onClick={handleOpen}>
            <Icon>podcasts</Icon>
            <MDTypography margin color="white" fontSize={14} fontWeight="bold">
              Add Podcast
            </MDTypography>
          </MDButton>
        </MDBox>
        {apiState.isLoadingPodcast || apiState.isDeletingPodcast ? (
          <MDBox p={2} mt={4} display="flex" justifyContent="center">
            <CircularProgress size={30} color="primary" />
          </MDBox>
        ) : (
          <Grid
            style={{
              marginTop: "24px",
            }}
            container
            spacing={2}
          >
            {allPodcast.map((podcast) => (
              <Grid item xs={12} sm={12} md={6} xl={4} key={podcast.id}>
                <PodcastCard
                  podcast={podcast}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSelect={handleCardSelect}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {pagination.totalItems > 10 && (
          <MDBox display="flex" width="100%" justifyContent="flex-end">
            <Pagination
              style={{
                marginTop: "20px",
              }}
              count={pagination.totalPages}
              page={pagination.currentPageNumber}
              onChange={handlePagination}
            />
          </MDBox>
        )}
      </Header>
      {isDialogOpen && (
        <PodcastDialog
          isLoading={apiState.isCreatingPodcast || apiState.isUpdatingPodcast}
          podcast={selectedPodcast}
          onCreate={handleCreate}
          onCancel={handleClose}
          isEditMode={isEditMode}
        />
      )}

      {isVideoPlayerOpen && (
        <Dialog
          fullScreen
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, p: 8 }}
          open={isVideoPlayerOpen}
          onClick={closeVideoPlayer}
        >
          <DialogTitle
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h4">{selectedPodcast.title}</MDTypography>
            <Icon
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                setVideoPlayerOpen(!isVideoPlayerOpen);
              }}
            >
              close
            </Icon>
          </DialogTitle>

          <DialogContent dividers>
            {getVideoId(selectedPodcast.link).service === "youtube" ? (
              <ReactPlayer
                width="100%"
                height="100%"
                playing
                url={selectedPodcast.link}
                config={{
                  youtube: {
                    autoPlay: 0,
                  },
                }}
              />
            ) : (
              <MDBox height="100%" display="flex" alignItems="center" justifyContent="center">
                <Typography>Unsupported video link</Typography>
              </MDBox>
            )}
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}

export default Podcast;
