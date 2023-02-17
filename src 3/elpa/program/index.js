import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";

import CircularProgress from "@mui/material/CircularProgress";
import HeaderInner from "../../app/shared/HeaderInner";
import apiLinks from "../../global/apiLinks";
import { createAPI, deleteAPI, updateAPI, loadList } from "../../services/request";
import MDButton from "../../components/MDButton";
import ProgramCard from "./components/ProgramCard";
import DashboardLayout from "../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../components/Navbars/DashboardNavbar";

// Overview page components
import ProgramDialog from "./components/ProgramDialog";

function Program() {
  const [apiState, setApiState] = useState({
    isLoading: true,
    isUpdating: false,
    isDeleting: false,
    isCreating: false,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 9,
  });

  const [isEditMode, setEditMode] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [allProgram, setAllProgram] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const fAfterProgramLoaded = ({ data = {} }) => {
    const { programs = [], currentPage = 1, totalPages = 1, totalItems = 0 } = data;
    setPagination({
      ...pagination,
      currentPage: currentPage || pagination.currentPage,
      totalPages: totalPages || pagination.currentPage,
      totalItems: totalItems || pagination.totalItems,
    });
    setAllProgram(programs);
    setApiState({
      ...apiState,
      isLoading: false,
    });
  };

  const fetchAllProgram = (value) => {
    setApiState({
      ...apiState,
      isLoading: true,
    });
    loadList(
      apiLinks.loadAllProgram(value || pagination.currentPage, pagination.pageSize),
      fAfterProgramLoaded
    );
  };

  const fAfterDeleteProgram = () => {
    setApiState({
      ...apiState,
      isDeleting: false,
    });
    fetchAllProgram();
  };

  const fAfterCreateProgram = () => {
    setApiState({
      ...apiState,
      isCreating: false,
    });
    setDialogOpen(false);
    fetchAllProgram();
  };

  const fAfterEditProgram = () => {
    setApiState({
      ...apiState,
      isUpdating: false,
    });

    setDialogOpen(false);
    setSelectedProgram(null);
    fetchAllProgram();
  };

  const deleteProgram = (id) => {
    setApiState({
      ...apiState,
      isDeleting: true,
    });
    deleteAPI(apiLinks.deleteProgram, id, fAfterDeleteProgram);
  };

  const createNewProgram = (item) => {
    setApiState({
      ...apiState,
      isCreating: true,
    });
    createAPI(apiLinks.createProgram, item, fAfterCreateProgram);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    handleOpen();
    setSelectedProgram(item);
  };

  const handleDelete = (item) => {
    deleteProgram(item.id);
  };

  const handleCreate = (item) => {
    if (isEditMode) {
      setApiState({
        ...apiState,
        isUpdating: true,
      });
      updateAPI(apiLinks.updateProgram, selectedProgram.id, item, fAfterEditProgram);
    } else {
      createNewProgram(item);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedProgram(null);
  };

  const handlePagination = (_, value) => {
    setPagination({
      ...pagination,
      currentPage: value,
    });
    fetchAllProgram(value);
  };

  useEffect(() => {
    fetchAllProgram();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <HeaderInner>
        <MDBox py={2} px={2} lineHeight={1.25} display="flex" justifyContent="space-between">
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              Program
            </MDTypography>
            <MDBox mb={1}>
              <MDTypography variant="button" color="text">
                Program for all
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDButton variant="gradient" color="info" onClick={handleOpen}>
            <Icon>settings_input_antenna</Icon>
            <MDTypography margin color="white" fontSize={14} fontWeight="bold">
              Add Program
            </MDTypography>
          </MDButton>
        </MDBox>
        {apiState.isLoading || apiState.isDeleting ? (
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
            {allProgram.map((item) => (
              <Grid item xs={12} sm={12} md={6} xl={4} key={item.id}>
                <ProgramCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
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
      </HeaderInner>
      {isDialogOpen && (
        <ProgramDialog
          isLoading={apiState.isCreating || apiState.isUpdating}
          item={selectedProgram}
          onCreate={handleCreate}
          onCancel={handleClose}
          isEditMode={isEditMode}
        />
      )}
    </DashboardLayout>
  );
}

export default Program;
