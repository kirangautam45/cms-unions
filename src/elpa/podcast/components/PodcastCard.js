/* eslint-disable react/prop-types */
import { useState } from "react";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import ReactPlayer from "react-player/youtube";
import CardMedia from "@mui/material/CardMedia";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import getVideoId from "get-video-id";
import MDButton from "../../../components/MDButton";

function PodcastCard({ podcast, onEdit, onDelete, onSelect }) {
  const [menu, setMenu] = useState(null);
  const openMenu = (e) => setMenu(e.currentTarget);
  const closeMenu = () => setMenu(null);

  const [isHover, setIsHover] = useState(false);

  const handleCardMediaClick = () => {
    onSelect(podcast);
  };

  const menuItemBenefits = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem
        onClick={() => {
          onEdit(podcast);
          closeMenu();
        }}
      >
        <Icon>podcasts</Icon>&nbsp;Edit
      </MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem
        onClick={() => {
          onDelete(podcast);
          closeMenu();
        }}
      >
        <Icon color="error">delete</Icon>
        <MDTypography variant="button" color="error" fontWeight="regular">
          &nbsp;Delete
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
        overflow: "visible",
        cursor: "pointer",
      }}
    >
      <MDBox
        onClick={handleCardMediaClick}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          cursor: "pointer",
        }}
      >
        {getVideoId(podcast.link).service === "youtube" && (
          <MDBox
            style={{
              position: "absolute",
              top: "calc(50% - 18px)",
              left: "calc(50% - 18px)",
            }}
          >
            <Icon color="warning" fontSize="large">
              play_circle
            </Icon>
          </MDBox>
        )}
        {isHover && getVideoId(podcast.link).service === "youtube" ? (
          <div
            style={{
              position: "relative",
              height: "250px",
              aspectRatio: 19 / 6,
            }}
          >
            <ReactPlayer
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
              playing
              url={podcast.link}
              config={{
                youtube: {
                  autoPlay: 0,
                },
              }}
              width="100%"
              height="100%"
            />
          </div>
        ) : (
          <CardMedia
            src={podcast.image}
            component="img"
            title={podcast.title}
            sx={{
              cursor: "pointer",
              height: "250px",
              aspectRatio: 19 / 6,
              margin: 0,
              boxShadow: ({ boxShadows: { md } }) => md,
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}
      </MDBox>

      <MDBox mt={1} mx={0.5}>
        <MDBox mb={1} display="flex" flexDirection="row" justifyContent="space-between">
          <MDTypography
            component="a"
            target="_blank"
            rel="noreferrer"
            variant="h5"
            textTransform="capitalize"
          >
            {podcast?.title}
          </MDTypography>
          {/* <MDBadge variant="contained" color="secondary" badgeContent="Basketball" container />{" "} */}
          <MDBox ml="auto" lineHeight={0}>
            <MDButton variant="text" color="secondary" size="medium" iconOnly onClick={openMenu}>
              <Icon sx={{ cursor: "pointer" }}>more_vert</Icon>
            </MDButton>
            {menuItemBenefits}
          </MDBox>
        </MDBox>
        <MDBox mb={3} lineHeight={0}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {podcast?.description}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PodcastCard;
