/* eslint-disable react/prop-types */
// Material Dashboard 2 PRO React components

import { useState } from "react";
import MDTypography from "components/MDTypography";
import MDBox from "../../../components/MDBox";

function DescriptionCell({ data, align, ellipsisLength }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MDBox component="div" textAlign={align} py={1.5}>
      <MDBox
        style={{
          overflow: "hidden",
          display: "flex",
        }}
        color="text"
        width="300px"
      >
        {data?.description.length > ellipsisLength ? (
          <MDTypography
            sx={({ typography: { size } }) => ({
              fontSize: size.sm,
              borderBottom: "none",
            })}
          >
            {!isOpen && `${data?.description.slice(0, ellipsisLength)}...`}
            {isOpen && data?.description}
            <MDTypography
              component="span"
              onClick={handleClick}
              sx={({ typography: { size } }) => ({
                fontSize: size.sm,
                borderBottom: "none",
                color: "blue",
                cursor: "pointer",
                marginLeft: "8px",
              })}
            >
              {!isOpen ? `view more` : `view less`}
            </MDTypography>
          </MDTypography>
        ) : (
          <MDTypography
            sx={({ typography: { size } }) => ({
              fontSize: size.sm,
              borderBottom: "none",
            })}
          >
            {data?.description}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
}

export default DescriptionCell;
