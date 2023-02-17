/* eslint-disable react/prop-types */
import { Autocomplete, Card, debounce, Divider, Switch } from "@mui/material";

import { useCallback, useEffect, useRef, useState } from "react";

import objects from "../../global/objects";
import MDBox from "../../components/MDBox";
import MDInput from "../../components/MDInput";
import FormField from "../components/layouts/applications/wizard/components/FormField";

function Filters({ searchTeamsMain }) {
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [advancedFiltersAreVisible, setAdvancedFiltersAreVisible] = useState(false);
  const refTeamSearch = useRef(null);
  const refRegionFilter = useRef(null);
  const refCountryFilter = useRef(null);
  const refLeagueFilter = useRef(null);

  useEffect(() => {
    objects.loadRegions(setRegions);
    objects.loadCountries(setCountries);
    objects.loadTheLeagues(setLeagues);
  }, []);

  const searchCallback = useCallback(() => {
    const filters = {
      gender: [],
      region:
        refRegionFilter.current.querySelector('input[type="text"]').value !== ""
          ? [refRegionFilter.current.querySelector('input[type="text"]').value]
          : [],
      country:
        refCountryFilter.current.querySelector('input[type="text"]').value !== ""
          ? [refCountryFilter.current.querySelector('input[type="text"]').value]
          : [],
      league:
        refLeagueFilter.current.querySelector('input[type="text"]').value !== ""
          ? [refLeagueFilter.current.querySelector('input[type="text"]').value]
          : [],
      page: 0,
      size: 10,
      teamName: refTeamSearch.current.querySelector("input[type='text']").value,
    };
    searchTeamsMain(filters);
  }, [refRegionFilter, refLeagueFilter, refCountryFilter, refTeamSearch]);

  const handleSearch = debounce(searchCallback, 300);

  const toggleAdvanceFilter = () => {
    setAdvancedFiltersAreVisible(!advancedFiltersAreVisible);
  };

  const renderAutocomplete = (ref, label, opts) => (
    <MDBox style={{ width: "100%" }} flex={1}>
      <Autocomplete
        onChange={handleSearch}
        ref={ref}
        fullWidth
        options={opts}
        renderInput={(params) => (
          <FormField {...params} label={label} InputLabelProps={{ shrink: true }} />
        )}
      />
    </MDBox>
  );

  return (
    <MDBox mb={2}>
      <Card style={{ width: "100%" }}>
        <MDBox pb={2}>
          <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox style={{ width: "100%", maxWidth: "300px" }}>
              <MDInput
                ref={refTeamSearch}
                fullWidth
                onKeyUp={handleSearch}
                label="Search Team By Name"
                inputProps={{ type: "text", autoComplete: "" }}
              />
            </MDBox>
            <MDBox mt={0.5}>
              <Switch checked={advancedFiltersAreVisible} onChange={toggleAdvanceFilter} />
              Advanced Filters
            </MDBox>
          </MDBox>
          <MDBox display={advancedFiltersAreVisible ? "block" : "none"}>
            <Divider />
            <MDBox display="flex" alignItems="center" gap={2} justifyContent="space-between" px={2}>
              {renderAutocomplete(refRegionFilter, "Region", regions)}
              {renderAutocomplete(refCountryFilter, "Country", countries)}
              {renderAutocomplete(refLeagueFilter, "League", leagues)}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default Filters;
