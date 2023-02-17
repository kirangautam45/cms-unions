/* eslint-disable react/prop-types */

import { useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";
import Cookie from "../../services/cookie";

function ElpaLogout(props) {
  const { setLogout } = props;

  useEffect(() => {
    localStorage.removeItem("loggedUser");
    Cookie.removeCookie("token");
    Cookie.removeCookie("refreshToken");
    setTimeout(() => {
      setLogout();
    }, 1000);
  }, []);

  return (
    <BasicLayout image="">
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            You Are Logged Out
          </MDTypography>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ElpaLogout;
