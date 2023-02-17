import PropTypes from "prop-types";

import { Card, Typography } from "@mui/material";

import PDFFileImage from "assets/images/pdf-file.png";

function FileCard({ name }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        boxShadow: "true",
        overflow: "visible",
        padding: "1rem",
        width: "fit-content",
      }}
    >
      <img src={PDFFileImage} width="80px" alt="pdf-file" />
      <Typography variant="h6" color="black">
        {name}
      </Typography>
    </Card>
  );
}

FileCard.defaultProps = {
  name: "",
};

FileCard.propTypes = {
  name: PropTypes.string,
};

export default FileCard;
