/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import { deleteAPI, loadFilteredList } from "../../services/request";
import apiLinks from "../../global/apiLinks";

// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 PRO React
import DashboardLayout from "../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../components/Navbars/DashboardNavbar";

import Filters from "./Filters";
import TableTeams from "./TableTeams";
import Pagination from "./Pagination";
import FormAddEditTEam from "./FormAddEditTEam";

function Teams() {
  const [modalIsOpenedProp, setModalIsOpenedProp] = useState(false);
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [teamEditId, setTeamEditId] = useState("");
  const [lastChangedFilters, setLastChangedFilters] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);

  const openTeamFormToCreate = () => {
    setIsForUpdate(false);
    setTeamEditId("");
    setModalIsOpenedProp(true);
  };

  const closeFormEditor = (newTeamDetails) => {
    addTheTeamsInTable([newTeamDetails]);
    setModalIsOpenedProp(false);
  };

  const addTheTeamsInTable = (teams) => {
    const teamsTemp = teams;
    for (let i = 0; i < teamsTemp.length; i += 1) {
      teamsTemp[i].teamNameLink = [teamsTemp[i].teamName, teamsTemp[i].id];
    }
    setFilteredTeams(teamsTemp);
  };

  const searchTeamsMain = (filters) => {
    setLastChangedFilters(filters);
    loadFilteredList(apiLinks.searchTheTeams, filters, ({ data = {} }) => {
      if (data.data) {
        addTheTeamsInTable(data.data);
      }
    });
  };

  const goToPageTable = (pageNumber) => {
    const newValues = {
      ...lastChangedFilters,
      page: pageNumber,
    };
    setLastChangedFilters(newValues);
    searchTeamsMain(newValues);
  };

  const goPrevPage = () => {
    const newValues = {
      ...lastChangedFilters,
      page: lastChangedFilters.page - 1,
    };
    setLastChangedFilters(newValues);
    searchTeamsMain(newValues);
  };

  const goNextPage = () => {
    const newValues = {
      ...lastChangedFilters,
      page: lastChangedFilters.page + 1,
    };
    setLastChangedFilters(newValues);
    searchTeamsMain(newValues);
  };

  const deleteTheTeam = (teamId) => {
    if (!window.confirm("Are you sure that you like to delete the team?")) return;
    deleteAPI(apiLinks.deleteTeam, teamId, (feedbackAfterDelete) => {
      console.log("feedbackAfterDelete:", feedbackAfterDelete);
      searchTeamsMain(lastChangedFilters);
    });
  };

  useEffect(() => {
    searchTeamsMain({
      country: [],
      gender: [],
      league: [],
      page: 0,
      region: [],
      size: 10,
      teamName: "",
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <FormAddEditTEam
          isForUpdate={isForUpdate}
          teamEditId={teamEditId}
          modalIsOpenedProp={modalIsOpenedProp}
          closeFormEditor={closeFormEditor}
        />
        <Filters searchTeamsMain={searchTeamsMain} />
        <Card id="teamsList" style={{ width: "100%" }}>
          <MDBox
            pt={2}
            px={2}
            pb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h6" fontWeight="medium">
              Teams
            </MDTypography>
            <MDBox display="flex" justifyContent="flex-end" alignItems="center">
              <MDButton variant="outlined" color="secondary">
                Download&nbsp;<Icon sx={{ fontWeight: "bold" }}>download</Icon>
              </MDButton>
              &nbsp; &nbsp;
              <MDButton variant="gradient" color="dark" onClick={openTeamFormToCreate}>
                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                &nbsp;If You Can not find the team add new
              </MDButton>
            </MDBox>
          </MDBox>
          <TableTeams filteredTeams={filteredTeams} deleteTheTeam={deleteTheTeam} />
          <Pagination
            filteredItems={filteredTeams}
            goToPageTable={goToPageTable}
            GoPrevPage={goPrevPage}
            GoNextPage={goNextPage}
          />
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Teams;
