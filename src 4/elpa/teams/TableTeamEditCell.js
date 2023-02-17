/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Divider, Icon, Menu, MenuItem } from "@mui/material";

import MDButton from "../../components/MDButton";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

function TableTeamEditCell({ teamId, deleteTheTeam }) {
  const [menuIsOpened, setMenuIsOpened] = useState(false);

  const handleOpenMenu = (event) => setMenuIsOpened(event.currentTarget);
  const handleCloseMenu = () => setMenuIsOpened(false);

  const onViewClick = () => {
    handleCloseMenu();
  };

  const onDeleteClick = () => {
    handleCloseMenu();
    deleteTheTeam(teamId);
  };

  const renderMenu = useCallback(
    () => (
      <Menu
        anchorEl={menuIsOpened}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(menuIsOpened)}
        onClose={handleCloseMenu}
        keepMounted
      >
        <MenuItem onClick={onViewClick}>
          <MDTypography
            component={Link}
            to={`/elpa/teams/${teamId}`}
            variant="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon sx={{ mt: 0.5 }}>visibility</Icon>&nbsp;View The Team
          </MDTypography>
        </MenuItem>
        {/* <MenuItem onClick={handleCloseMenu, ()=>{console.log(teamId);}}><Icon>edit</Icon>&nbsp;Edit The Team</MenuItem> */}
        <Divider />
        <MenuItem onClick={onDeleteClick}>
          <MDBox color="error" display="flex" alignItems="center">
            <Icon>delete</Icon>&nbsp;Delete The Team
          </MDBox>
        </MenuItem>
      </Menu>
    ),
    [menuIsOpened]
  );

  return (
    <>
      <MDButton onClick={handleOpenMenu}>
        <Icon>more_vertical</Icon>
      </MDButton>
      {renderMenu()}
    </>
  );
}

export default TableTeamEditCell;
