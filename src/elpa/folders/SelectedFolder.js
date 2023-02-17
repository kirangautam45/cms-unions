import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "elpa/components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "elpa/components/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";

import { get } from "services/request";
import FileCard from "./FileCard";

function SelectedFolder() {
  const { folderId } = useParams();
  const [folderData, setFolderData] = useState(null);
  const [listFiles, setListFiles] = useState([]);

  const findFolderById = async () => {
    const result = await get(`union/get/folder/${folderId}`);

    setFolderData(result.data);
  };

  useEffect(() => {
    if (folderId) {
      findFolderById(folderId);
    }
  }, [folderId]);

  const LoadFiles = async () => {
    const result = await get(`union/get/all/files/${folderId}`);

    const NewLoadedFolders = result.data.map((data) => (
      <Grid item xs={12} md={6} xl={3} key={`files-${data.id}`}>
        <FileCard
          name={data.fileName}
          onClick={() => window.location.replace(`/elpa/folders/${data.id}`)}
        />
      </Grid>
    ));
    setListFiles(NewLoadedFolders);
  };

  useEffect(() => {
    LoadFiles();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar defaultTitle={(folderData && folderData.name) || "Loading"} />
      <MDBox my={2} p={2}>
        <MDBox>
          Folder: {(folderData && folderData.name) || "Loading"}
          <Grid container mt={1}>
            {listFiles}
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
export default SelectedFolder;
