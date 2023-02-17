/* eslint-disable camelcase */
import { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

import MDAlert from "components/MDAlert";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import BasicLayout from "elpa/components/BasicLayout";
import { setHeader, loadPublicData } from "services/request";
import apiLinks from "../../global/apiLinks";
import Cookie from "../../services/cookie";

function ElpaLogin({ setLogged }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = () => {
    setIsLogging(true);

    loadPublicData(
      apiLinks.login,
      {
        username,
        password,
        rememberMe,
      },
      ({ data }) => {
        if (data?.response) {
          const {
            response: { accessToken, refreshToken, userInfo },
          } = data;
          const expiredTime = 14 * 24 * 60; // 14 days
          localStorage.setItem("loggedUser", JSON.stringify(userInfo));
          Cookie.setCookie("token", accessToken, expiredTime);
          Cookie.setCookie("refreshToken", refreshToken, expiredTime);
          setHeader(accessToken);
          setLogged();
        } else {
          setErrorMessage("Wrong username and password");
        }
      },
      (error) => {
        setErrorMessage(error);
        setIsLogging(false);
      }
    );
  };

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
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                sign in {isLogging ? <span>...</span> : null}
              </MDButton>
              {errorMessage !== "" ? (
                <MDBox mt={2}>
                  <MDAlert color="error" m={0} py={2}>
                    {errorMessage}
                  </MDAlert>
                </MDBox>
              ) : null}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

ElpaLogin.defaultProps = {
  setLogged: () => {},
};

ElpaLogin.propTypes = {
  setLogged: PropTypes.func,
};

export default ElpaLogin;
