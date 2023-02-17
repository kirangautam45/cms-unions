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

import { useState, useEffect, useMemo } from "react";

// Material Dashboard 2 PRO React routes
import routes from "routes";
// Material Dashboard 2 PRO React contexts
import { useMaterialUIController, setMiniSidenav /* , setOpenConfigurator */ } from "context";

// react-router components
// import { Switch, Route, Redirect } from 'react-router-dom';
// Redirect in new version of reactor is changed with Navigate
import { Routes, Route, Navigate, useLocation /* useNavigate */ } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
// import MDBox from "components/MDBox";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 PRO React examples
// import Sidenav from "examples/Sidenav";
import Sidenav from "./elpa/components/Sidenav/index";
import Configurator from "./examples/Configurator";

// Material Dashboard 2 PRO React themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";

// Material Dashboard 2 PRO React Dark Mode themes
import themeDark from "./assets/theme-dark";
import themeDarkRTL from "./assets/theme-dark/theme-rtl";

// import ElpaLogin from "elpa/login/index";

// import ElpaPost from "elpa/post/index";

// Custom plugin installed by me, the theme have not alerts.
// import "react-confirm-alert/src/react-confirm-alert.css"; installed but not working
import "./additional-css.css";

// Images
import brandWhite from "./assets/images/logo-ct.png";
import brandDark from "./assets/images/logo-ct-dark.png";
import loggedUser from "./global/loggedUser";
import ElpaLogin from "./elpa/login";
import ElpaLogout from "./elpa/login/logout";
// import apiLinks from "./global/apiLinks";
import Cookie from "./services/cookie";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    // openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [isLogged, setIsLogged] = useState(Cookie.checkCookie("token"));

  const setLogged = () => {
    setIsLogged(true);
  };

  const setLogout = () => {
    setIsLogged(false);
  };

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  useEffect(() => {
    loggedUser.setLogged = setLogged;
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  // const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.route === "/elpa/login") {
        return (
          <Route
            exact
            path={route.route}
            element={<ElpaLogin setLogged={setLogged} />}
            key={route.key}
          />
        );
      }
      if (route.route && route.route === "/elpa/logout") {
        return (
          <Route
            exact
            path={route.route}
            element={<ElpaLogout setLogout={setLogout} />}
            key={route.key}
          />
        );
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  /* const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  ); */

  const redirectToLoginIfNotLoggedIn = () => {
    if (pathname !== "/elpa/login" && !isLogged)
      return <Route path="*" element={<Navigate to="/elpa/login" />} key="redirect-to-login" />;
    if (pathname === "/elpa/login" && isLogged)
      return <Route path="*" element={<Navigate to="/elpa/members" />} key="redirect-to-home" />;
    return getRoutes(routes);
  };

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Material Dashboard PRO"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {
              // configsButton
            }
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/elpa/members" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Material Dashboard PRO 2222"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            className="sidebarmenu"
          />
          <Configurator />
          {
            // configsButton
          }
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {redirectToLoginIfNotLoggedIn()}
        <Route path="*" element={<Navigate to="/elpa/members" />} />
      </Routes>
    </ThemeProvider>
  );
}
