/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

import MDTypography from "../../components/MDTypography";

export default function TableCellLink({ teamName, teamId }) {
  return (
    <div>
      <MDTypography
        component={Link}
        to={`/elpa/teams/${teamId}`}
        variant="h5"
        textTransform="capitalize"
      >
        {teamName}
      </MDTypography>
    </div>
  );
}
