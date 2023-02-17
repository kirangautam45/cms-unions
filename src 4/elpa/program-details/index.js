import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import HeaderInner from "../../app/shared/HeaderInner";
import apiLinks from "../../global/apiLinks";
import { updateAPI, loadList } from "../../services/request";
import DashboardLayout from "../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../components/Navbars/DashboardNavbar";
import ProgramDialog from "../program/components/ProgramDialog";

function ProgramDetails() {
  const [apiState, setApiState] = useState({
    isLoading: true,
    isUpdating: false,
    error: null,
  });
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const toggleEditProgram = () => setShowEdit((s) => !s);

  const fAfterProgramLoaded = ({ data }) => {
    setApiState({
      ...apiState,
      isLoading: false,
      error: !data ? "Whoops, Something went wrong!" : "",
    });
    if (data) {
      setProgram(data);
    }
  };

  const fetchProgramDetails = () => {
    setApiState({
      ...apiState,
      isLoading: true,
    });
    loadList(apiLinks.loadProgramById(programId), fAfterProgramLoaded);
  };

  const fAfterEditProgram = () => {
    setApiState({
      ...apiState,
      isUpdating: false,
    });
    toggleEditProgram();
    fetchProgramDetails();
  };

  const onUpdateProgram = (item) => {
    setApiState({
      ...apiState,
      isUpdating: true,
    });
    updateAPI(apiLinks.updateProgram, program.id, item, fAfterEditProgram);
  };

  useEffect(() => {
    fetchProgramDetails();
  }, []);

  const renderProgram = () => {
    if (program) {
      return (
        <MDBox>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDBox mb={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  {program.title}
                </MDTypography>
              </MDBox>
              <MDTypography component="p" variant="button" color="text">
                <b>Start date: </b>
                {program.startDate
                  ? moment(program.startDate, "YYYY-MM-DD").format("MMM DD, YYYY")
                  : "-"}
              </MDTypography>
              <MDTypography component="p" variant="button" color="text">
                <b>Duration: </b>
                {program.duration || "-"}
              </MDTypography>
              <MDTypography component="p" variant="button" color="text">
                <b>Sign-up and info: </b>
                {program.contactPerson || "-"}
              </MDTypography>
            </MDBox>
            <MDButton
              variant="gradient"
              color="dark"
              onClick={toggleEditProgram}
              sx={{ whiteSpace: "nowrap" }}
            >
              Edit program
            </MDButton>
          </MDBox>
          <MDBox mt={2}>
            <div
              dangerouslySetInnerHTML={{ __html: program.description }}
              className="program-inner-text"
            />
          </MDBox>
        </MDBox>
      );
    }
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" p={2}>
        <MDTypography component="p" variant="button" color="error" text="center">
          {apiState.error || "ERROR"}
        </MDTypography>
      </MDBox>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <HeaderInner>
        {apiState.isLoading ? (
          <MDBox p={2} mt={4} display="flex" justifyContent="center">
            <CircularProgress size={30} color="primary" />
          </MDBox>
        ) : (
          renderProgram()
        )}
      </HeaderInner>
      {showEdit && (
        <ProgramDialog
          isLoading={apiState.isUpdating}
          item={program}
          onCreate={onUpdateProgram}
          onCancel={toggleEditProgram}
          isEditMode
        />
      )}
    </DashboardLayout>
  );
}

export default ProgramDetails;
