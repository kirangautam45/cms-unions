/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// import Grid from "@mui/material/Grid";

import { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";

import apiLinks from "../../global/apiLinks";
import { loadObject } from "../../services/request";

import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
// import masterCardLogo from "./assets/images/logos/mastercard.png";
// import Tooltip from "@mui/material/Tooltip";
import MDButton from "../../components/MDButton";
import DataTable from "./TeamCell/DataTable";

import DefaultCell from "./DataTable/DefaultCell";
import MemberActionsCell from "./actionsCell";

// import TeamMembersTable from "elpa/teams/TeamMembersTable";

// const { darkMode } = controller;

function TeamSection(props) {
  const { teamId, FOpenTeamToEdit, FDeleteTeam } = props;

  const [LoadTheMembersData, setLoadTheMembersData] = useState(false);
  const LoadMembersTableOnce = () => {
    if (!LoadTheMembersData) {
      setLoadTheMembersData(true);
      LoadAllMembers();
    }
  };

  const dataMembersColumns = [
    {
      Header: "date",
      accessor: "becomeMember",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "name",
      accessor: "firstName",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "surname",
      accessor: "lastName",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "status",
      accessor: "paid",
      Cell: ({ value }) => {
        if (value === true) {
          return <DefaultCell value="it is true" />;
        }
        return <DefaultCell value={value} />;
      },
    },
    // eslint-disable-next-line no-use-before-define
    {
      Header: "",
      accessor: "id",
      Cell: ({ value }) => (
        <MemberActionsCell
          memberid={value}
          DeleteUser={() => {
            console.log("Delete test");
          }}
          OpenUserEditor={() => {
            console.log("Is Working");
          }}
        />
      ),
    },
  ];
  dataMembersColumns.defaultProps = {
    value: "",
  };

  const [TableBoxSectionIsVisible, setTableBoxSectionIsVisible] = useState(false);
  const [membersdata, setMembersData] = useState([]);
  const dataMembersTableData = {
    columns: dataMembersColumns,
    rows: membersdata,
  };
  const LoadAllMembers = () => {
    /* console.log("Loading members for team init....");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
      // mode: "no-cors", 
      body: JSON.stringify({
        teamId
      })
    };
    fetch(apiLinks.membersForTeam, requestOptions)
      .then((response)=>response.json())
      .then((response)=>{
        
        console.log('response after Load memebers:', response);
        setMembersData(response.response);
      }); */
    loadObject(apiLinks.getTeamMembers, teamId, (membersForTheTeam) => {
      setMembersData(membersForTheTeam);
    });
  };

  const [dataForTeam, setDataForTeam] = useState({
    id: "",
    region: "",
    league: "",
    country: "",
    teamName: "",
    teamLogo: "",
    address: "",
    city: "",
    street: "",
    phone: "",
    coach: "",
    website: "",
    facebook: "",
    twitter: "",
    teamColors: "",
    gender: "",
  });
  useEffect(() => {
    loadObject(apiLinks.getTeam, teamId, (teamDB) => {
      console.log("teamDB:", teamDB);
      setDataForTeam(teamDB);
    });
  }, []);

  return (
    <MDBox>
      <MDBox
        className="TeamItem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        sx={{
          border: ({ borders: { borderWidth, borderColor } }) =>
            `${borderWidth[1]} solid ${borderColor}`,
        }}
      >
        <MDBox>
          <MDTypography variant="h5" fontWeight="medium">
            {dataForTeam.teamName}
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium">
            {dataForTeam.country}, {dataForTeam.league}
          </MDTypography>
          <MDTypography variant="h7" fontWeight="medium">
            0 Members
          </MDTypography>
        </MDBox>
        <MDBox ml="auto" display="flex" alignItems="center" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="secondary"
            iconOnly
            onClick={() => {
              LoadMembersTableOnce();
              setTableBoxSectionIsVisible(!TableBoxSectionIsVisible);
            }}
          >
            <Icon>keyboard_arrow_down</Icon>
          </MDButton>
          &nbsp;&nbsp;&nbsp;
          <MDButton
            onClick={() => {
              FOpenTeamToEdit(teamId);
            }}
            variant="outlined"
            color="secondary"
            iconOnly
          >
            <Icon>edit</Icon>
          </MDButton>
          &nbsp;&nbsp;&nbsp;
          <MDButton
            onClick={() => {
              FDeleteTeam(teamId);
            }}
            variant="outlined"
            color="error"
            iconOnly
          >
            <Icon>delete</Icon>
          </MDButton>
        </MDBox>
      </MDBox>

      <MDBox display={TableBoxSectionIsVisible ? "block" : "none"}>
        <MDBox>
          <DataTable table={dataMembersTableData} entriesPerPage={false} canSearch />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
export default TeamSection;
