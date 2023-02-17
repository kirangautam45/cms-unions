import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

import { get } from "services/request";

import DashboardLayout from "elpa/components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "elpa/components/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";

import FolderCard from "./FolderCard";

function ElpaFolders() {
  const [listFolders, setListFolders] = useState([]);

  const loadFolders = async () => {
    try {
      const { data } = await get("union/get/all/folders?page=0&size=10");
      setListFolders(data.folders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={2}>
        <MDBox p={2}>
          <Grid container gap={2}>
            {listFolders.map((item) => (
              <Grid item xs={12} md={6} xl={3} key={`folder-${item.id}`}>
                <FolderCard name={item.name} to={`/elpa/folders/${item.id}`} />
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default ElpaFolders;
