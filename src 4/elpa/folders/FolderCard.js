import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Card, Typography } from "@mui/material";

import FolderImage from "assets/images/folder.png";

function FolderCard({ name, to }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        boxShadow: "true",
        overflow: "visible",
        padding: "1rem",
        cursor: "pointer",
      }}
      to={to}
      component={Link}
    >
      <img src={FolderImage} width="100px" alt="folder" />
      <Typography variant="h6" mt={-2} color="black">
        {name}
      </Typography>
    </Card>
  );
}

FolderCard.propTypes = {
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default FolderCard;
