/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import { useEffect, useRef, useState } from "react";
import { Autocomplete, Divider, Grid } from "@mui/material";
import FormField from "layouts/applications/wizard/components/FormField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import apiLinks from "global/apiLinks";
import { loadFilteredList, loadList } from "services/request";

function FormFilters(props) {
  const { formFiltersIsVisible } = props;

  const [regions, setRegions] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    loadList(apiLinks.loadTheCountries, (countriesDB) => {
      setCountries(countriesDB);
    });
    loadList(apiLinks.loadTheLeagues, (leaguesDB) => {
      setLeagues(leaguesDB);
    });
    loadList(apiLinks.loadTheRegions, (regionsDB) => {
      setRegions(regionsDB);
    });
  }, []);

  const [teamsList, setTeamsList] = useState([]);
  const [, setTeamsData] = useState(null);
  const refRegionFilter = useRef(null);
  const refCountryFilter = useRef(null);
  const refLeagueFilter = useRef(null);

  const loadTheTeamsList = (filters) => {
    loadFilteredList(apiLinks.searchTheTeams, filters, ({ data }) => {
      const newTeamsListOptions = [];
      for (let i = 0; i < data.length; i += 1) {
        newTeamsListOptions.push(data[i].teamName);
      }
      setTeamsList(newTeamsListOptions);
      setTeamsData(data);
    });
  };
  const getTemplateFilters = () => {
    const filtersTemplate = {
      gender: [],
      region: [],
      country: [],
      league: [],
      page: 0,
      size: 20,
      teamName: "",
    };
    return filtersTemplate;
  };
  const FilterTheTeams = () => {
    setTimeout(() => {
      const filters = getTemplateFilters();
      //
      const fRegionV = refRegionFilter.current.querySelector('input[type="text"]').value;
      if (fRegionV !== "") filters.region = [fRegionV];
      const fCountryV = refCountryFilter.current.querySelector('input[type="text"]').value;
      if (fCountryV !== "") filters.country = [fCountryV];
      const fLeagueV = refLeagueFilter.current.querySelector('input[type="text"]').value;
      if (fLeagueV !== "") filters.league = [fLeagueV];
      loadTheTeamsList(filters);
    }, 1);
  };

  return (
    <Grid item xs={12} style={{ display: !formFiltersIsVisible ? "none" : "block" }}>
      <MDBox py={3}>
        <Divider />
        <MDBox mb={2}>
          <MDTypography variant="h5">Filter Teams</MDTypography>
        </MDBox>
        <MDBox mb={2}>
          <Autocomplete
            ref={refRegionFilter}
            onChange={() => {
              FilterTheTeams();
            }}
            options={regions}
            renderInput={(params) => (
              <FormField {...params} label="Search Region" InputLabelProps={{ shrink: true }} />
            )}
          />
        </MDBox>
        <MDBox mb={2}>
          <Autocomplete
            ref={refCountryFilter}
            onChange={() => {
              FilterTheTeams();
            }}
            options={
              countries
              /* [
                "Macedonia",
                "Croatia",
                "Searbia",
                "Bulgaria",
                "Russia",
                "Germany",
                "Italy"
              ] */
            }
            renderInput={(params) => (
              <FormField {...params} label="Search Country" InputLabelProps={{ shrink: true }} />
            )}
          />
        </MDBox>
        <MDBox mb={2}>
          <Autocomplete
            ref={refLeagueFilter}
            onChange={() => {
              FilterTheTeams();
            }}
            options={leagues}
            renderInput={(params) => (
              <FormField {...params} label="Search League" InputLabelProps={{ shrink: true }} />
            )}
          />
        </MDBox>
        <MDBox mb={2}>
          <Autocomplete
            options={teamsList}
            renderInput={(params) => (
              <FormField {...params} label="Search Team" InputLabelProps={{ shrink: true }} />
            )}
          />
        </MDBox>
        <MDBox display="flex" justifyContent="flex-end">
          <MDButton variant="gradient" color="warning">
            Add The Filtered Team
          </MDButton>
        </MDBox>
      </MDBox>
    </Grid>
  );
}
export default FormFilters;
