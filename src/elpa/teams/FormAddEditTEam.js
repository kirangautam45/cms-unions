/* eslint-disable no-use-before-define */
/* eslint-disable object-shorthand */
/* eslint-disable no-self-compare */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import {
  useEffect,
  useRef,
  useState,
  // useState
} from "react";

import Grid from "@mui/material/Grid";
import { Autocomplete } from "@mui/material";

import { createAPI, updateAPI } from "../../services/request";
import objects from "../../global/objects";
import apiLinks from "../../global/apiLinks";

import ZModal from "../components/modal";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import FormField from "../components/layouts/applications/wizard/components/FormField";
// import Icon from "@mui/material/Icon";
// import apiLinks from "global/apiLinks";
// import Icon from "@mui/material/Icon";

function FormAddEditTEam(props) {
  const {
    isForUpdate,
    // teamEditId,
    modalIsOpenedProp,
    closeFormEditor,
    // LoadTeamsData,
    teamDataForUpdate,
    fAfterUpdateTheTeam,
  } = props;

  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const refName = useRef();
  const refTeamColors = useRef();
  const refRegion = useRef();
  const refCountry = useRef();
  const refLeague = useRef();
  const refAddress = useRef();
  const refCity = useRef();
  const refStreet = useRef();
  const refPhone = useRef();
  const refCoach = useRef();
  const refWebsite = useRef();
  const refFacebook = useRef();
  const refTwitter = useRef();

  const handleSaveTheData = () => {
    /* {
        "region": "Africa proba", 
        "league": "D1 proba", 
        "country": "Algeria proba", 
        "teamName": "u.s.m.a. alger proba", 
        "teamLogo": "a", 
        "address": "a", 
        "city": "a", 
        "street": "a", 
        "phone": "a", 
        "coach": "a", 
        "website": "a", 
        "facebook": "a", 
        "twitter": "a", 
        "teamColors": "a", 
        "gender": "Female"
    } */

    const detailsTeam = {
      region: refRegion.current.querySelector('input[type="text"]').value,
      league: refLeague.current.querySelector('input[type="text"]').value,
      country: refCountry.current.querySelector('input[type="text"]').value,
      teamName: refName.current.querySelector('input[type="text"]').value,
      teamLogo: "a",
      address: refAddress.current.querySelector("textarea").value,
      city: refCity.current.querySelector('input[type="text"]').value,
      street: refStreet.current.querySelector("textarea").value,
      phone: refPhone.current.querySelector('input[type="text"]').value,
      coach: refCoach.current.querySelector('input[type="text"]').value,
      website: refWebsite.current.querySelector('input[type="text"]').value,
      facebook: refFacebook.current.querySelector('input[type="text"]').value,
      twitter: refTwitter.current.querySelector('input[type="text"]').value,
      teamColors: refTeamColors.current.querySelector('input[type="text"]').value,
      gender: "Female",
    };

    if (isForUpdate) {
      updateAPI(apiLinks.updateTeam, teamDataForUpdate.id, detailsTeam, fAfterUpdateTheTeam);
    } else {
      createAPI(apiLinks.createTeam, detailsTeam, (teamNewFeedback) => {
        detailsTeam.id = teamNewFeedback.id;
        closeFormEditor(detailsTeam);
      });
    }
  };

  useEffect(() => {
    objects.loadRegions(setRegions);
    objects.loadCountries(setCountries);
    objects.loadTheLeagues(setLeagues);
  }, []);

  useEffect(() => {
    if (modalIsOpenedProp) {
      refName.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.teamName;
      refLeague.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.league;
      refCountry.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.country;
      refRegion.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.region;
      refAddress.current.querySelector("textarea").value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.address;
      refCity.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.city;
      refStreet.current.querySelector("textarea").value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.street;
      refPhone.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.phone;
      refCoach.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.coach;
      refWebsite.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.website;
      refFacebook.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.facebook;
      refTwitter.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.twitter;
      refTeamColors.current.querySelector('input[type="text"]').value =
        teamDataForUpdate === undefined ? "" : teamDataForUpdate.teamColors;
    }
  }, [modalIsOpenedProp, teamDataForUpdate]);

  return (
    <ZModal opened={modalIsOpenedProp}>
      <MDBox>
        <MDBox mb={3}>
          <MDTypography variant="h5">{isForUpdate ? "Update" : "Create"} Team</MDTypography>
        </MDBox>
        <MDBox component="form" mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDInput ref={refName} fullWidth variant="outlined" label="Team Name" />
            </Grid>
            <Grid item xs={12}>
              <MDInput ref={refTeamColors} fullWidth variant="outlined" label="TeamColors" />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                ref={refRegion}
                fullWidth
                options={regions}
                renderInput={(params) => (
                  <FormField {...params} label="Region" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                ref={refCountry}
                fullWidth
                options={countries}
                renderInput={(params) => (
                  <FormField {...params} label="Country" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <MDInput ref={refLeague} fullWidth variant="outlined" label="League" /> */}
              <Autocomplete
                ref={refLeague}
                fullWidth
                options={leagues}
                renderInput={(params) => (
                  <FormField {...params} label="League" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                ref={refAddress}
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                label="Address"
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput ref={refCity} fullWidth variant="outlined" label="City" />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                ref={refStreet}
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                label="Street"
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput ref={refPhone} fullWidth variant="outlined" label="Phone" />
            </Grid>
            <Grid item xs={12}>
              <MDInput ref={refCoach} fullWidth variant="outlined" label="Coach" />
            </Grid>
            <Grid item xs={12}>
              <MDInput ref={refWebsite} fullWidth variant="outlined" label="Website" />
            </Grid>
            <Grid item xs={12}>
              <MDInput ref={refFacebook} fullWidth variant="outlined" label="Facebook" />
            </Grid>
            <Grid item xs={12}>
              <MDInput ref={refTwitter} fullWidth variant="outlined" label="Twitter" />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-end" alignItems="center" gap={0.5}>
          <MDButton variant="outlined" color="secondary" onClick={closeFormEditor}>
            Close
          </MDButton>
          <MDButton variant="gradient" color="warning" onClick={handleSaveTheData}>
            {isForUpdate ? "Update New Team" : "Add New Team"}
          </MDButton>
        </MDBox>
      </MDBox>
    </ZModal>
  );
}
export default FormAddEditTEam;
