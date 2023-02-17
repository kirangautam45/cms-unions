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
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import apiLinks from "../../../global/apiLinks";
import { loadObject } from "../../../services/request";

// Material Dashboard 2 PRO React components
import MDBox from "../../../components/MDBox";
// import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 PRO React
import DashboardLayout from "../../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../components/Navbars/DashboardNavbar";
// import Footer from "../../components/Footer";
import ProfileInfoCard from "./components/ProfileInfoCard";
// import ProfilesList from "../../components/Lists/ProfilesList";
// import DefaultProjectCard from "../../components/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "./components/Header";
// import PlatformSettings from "./components/PlatformSettings";

// Data
// import profilesListData from "../../components/layouts/pages/profile/profile-overview/data/profilesListData";

// Images
/* import homeDecor1 from "../../../assets/images/home-decor-1.jpg";
import homeDecor2 from "../../../assets/images/home-decor-2.jpg";
import homeDecor3 from "../../../assets/images/home-decor-3.jpg";
import homeDecor4 from "../../../assets/images/home-decor-4.jpeg";
import team1 from "../../../assets/images/team-1.jpg";
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg"; */

function TeamView() {
  const { teamId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadObject(apiLinks.getTeam, teamId, ({ data: team }) => {
      setData(team);
    });
  }, []);

  const fAfterUpdateTheTeam = (updatedTeamData) => {
    setData(updatedTeamData);
  };

  if (data === null) return null;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header data={data}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              {/* <PlatformSettings /> */}
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                fAfterUpdateTheTeam={fAfterUpdateTheTeam}
                title="Team information"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel pulvinar est. Aliquam consectetur laoreet lacus non euismod. Quisque eget porta est, vitae tempus nibh. Duis et vulputate lorem. Quisque ornare, nibh sed commodo tempus, diam felis finibus elit, vitae consectetur felis mi vel turpis. Praesent condimentum metus libero, eu pretium ipsum sollicitudin et. Nam mollis magna sit amet dui dignissim tincidunt id in arcu. Proin id volutpat nisl, at pellentesque velit. Ut quis velit in ex aliquam scelerisque. Curabitur convallis nec urna vitae ornare."
                data={data}
                social={[
                  {
                    link: "https://www.facebook.com/CreativeTim/",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/creativetim",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/creativetimofficial/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Team" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              {/* <ProfilesList title="Members" profiles={profilesListData} shadow={false} /> */}
            </Grid>
          </Grid>
        </MDBox>
        {/*
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox>
              */}
      </Header>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default TeamView;
