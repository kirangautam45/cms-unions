/* eslint-disable react/prop-types */
import { Autocomplete, Divider, Grid, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
// import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import FormField from "layouts/applications/wizard/components/FormField";
import { useState } from "react";

import FormFilters from "elpa/teams/FormFilters";
import MDInput from "components/MDInput";
import apiLinks from "global/apiLinks";
import { loadFilteredList } from "services/request";
import DataTable from "elpa/members/DataTable";

// import dataSearchByTeamName from "elpa/teams/dataSearchByTeamName";
// import nikeV22 from "./assets/images/ecommerce/blue-shoe.jpeg";
import TeamCell from "./TeamCell";

const { default: ZModal } = require("elpa/components/modal");

/* eslint-disable prettier/prettier */
function FormSearchTeam(props) {
  const {
    FAddTheTeam,
    modalIsOpenedProp,
    CloseSearchTeamModal,
    OpenTeamFormToCreate, // it will open modal for creating team
  } = props;

  const [formFiltersIsVisible, setFormFiltersIsVisible] = useState(true);
  const showFormFilters = () => {
    setFormFiltersIsVisible(!formFiltersIsVisible);
  };

  const [teamsFilteredList, setTeamsFilteredList] = useState({
    columns: [],
    rows: [],
  });
  const SearchTeamsByName = (searchTeamValue) => {
    const filters = {
      gender: [],
      region: [],
      country: [],
      league: [],
      page: 0,
      size: 3,
      teamName: searchTeamValue,
    };

    loadFilteredList(apiLinks.searchTheTeams, filters, (teamsDB) => {
      const dataSearchByTeamName = {
        columns: [{ Header: "Team", accessor: "team" }],
        rows: [],
      };

      dataSearchByTeamName.rows = teamsDB.data.map((dataTeam) => ({
        team: (
          <TeamCell
            teamId={dataTeam.id}
            image={dataTeam.teamLogo}
            name={dataTeam.teamName}
            league={dataTeam.league}
            FAddTheTeam={FAddTheTeam}
          />
        ),
      }));

      setTeamsFilteredList(dataSearchByTeamName);
    });
  };

  return (
    <ZModal opened={modalIsOpenedProp}>
      <MDBox>
        <MDBox mb={3}>
          <MDTypography variant="h4">Add Team</MDTypography>
          <MDTypography variant="body2">Search The Team And Add to the list</MDTypography>
        </MDBox>
        <Divider />
        <MDBox component="form" mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDTypography variant="h5">Find Team</MDTypography>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDBox pr={1} style={{ width: "100%" }}>
                  {/*
                    <Autocomplete
                      options={[
                        "Team 1",
                        "Team 2",
                        "Team 3"
                      ]}
                      renderInput={(params) => (
                        <FormField {...params} label="Search Team" InputLabelProps={{ shrink: true }} />
                      )}
                    />
                    */}
                  <MDInput
                    fullWidth
                    onKeyUp={(e) => {
                      console.log(e.target.value);
                      SearchTeamsByName(e.target.value);
                    }}
                    label="Search Team By Name"
                    inputProps={{ type: "text", autoComplete: "" }}
                  />
                </MDBox>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  iconOnly
                  onClick={() => {
                    showFormFilters();
                  }}
                >
                  <Icon>filter_alt</Icon>
                </MDButton>
              </MDBox>
              <MDBox>
                <DataTable
                  table={teamsFilteredList}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  isSorted={false}
                  noEndBorder
                />
              </MDBox>
            </Grid>

            <FormFilters formFiltersIsVisible={formFiltersIsVisible} />

            <Grid item xs={12}>
              <MDBox display="flex" alignItems="center" justifyContent="space-between">
                <MDTypography variant="body2">Was not able to find team in list?</MDTypography>
                <MDBox>
                  <MDButton
                    variant="text"
                    color="warning"
                    onClick={() => {
                      OpenTeamFormToCreate();
                    }}
                  >
                    + Add New
                  </MDButton>
                </MDBox>
              </MDBox>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <MDTypography variant="h5">Find Member</MDTypography>
              <Autocomplete
                options={["Member 1", "Member 2", "Member 3"]}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    label="Search members"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <MDBox display="flex" justifyContent="flex-end" alignItems="center" pt={3}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    CloseSearchTeamModal();
                  }}
                >
                  Cancel
                </MDButton>
                &nbsp; &nbsp;
                <MDButton variant="gradient" color="dark">
                  Add New Team
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </ZModal>
  );
}
export default FormSearchTeam;
