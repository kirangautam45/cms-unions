/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Icon } from "@mui/material";

import MDBox from "../../components/MDBox";
import MDPagination from "../../components/MDPagination";
import MDTypography from "../../components/MDTypography";

function Pagination(props) {
  const {
    /* 
    filteredItems should contain: 
    "totalPages": 3,
    "currentPage": 0 
    */
    filteredItems,
    goToPageTable,
    GoPrevPage,
    GoNextPage,
  } = props;

  if (filteredItems === null) {
    return null;
  }

  const [pages, setPages] = useState([]);

  const gotoPage = (n) => {
    goToPageTable(n);
  };

  const renderPagination = () =>
    pages.map((option) => (
      <MDPagination
        item
        key={option}
        onClick={() => gotoPage(Number(option))}
        active={option === filteredItems.currentPage}
      >
        {option + 1}
      </MDPagination>
    ));

  useEffect(() => {
    let pageMin = filteredItems.currentPage - 3;
    let pageMax = filteredItems.currentPage + 6;
    const pageOptions = [];

    if (pageMin < 0) {
      pageMin = 0;
    }
    if (pageMax > filteredItems.totalPages) {
      pageMax = filteredItems.totalPages - 1;
    }
    for (let i = pageMin; i <= pageMax; i += 1) {
      pageOptions.push(i);
    }
    setPages(pageOptions);
  }, [filteredItems]);

  return (
    <MDBox
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      p={3}
    >
      <MDBox mb={{ xs: 3, sm: 0 }}>
        {!Number.isNaN(filteredItems.currentPage * filteredItems.size) && (
          <MDTypography variant="button" color="secondary" fontWeight="regular">
            <div>
              Showing {1 + filteredItems.currentPage * filteredItems.size} to{" "}
              {(filteredItems.currentPage + 1) * filteredItems.size} of{" "}
              {filteredItems.totalElements} teams
            </div>
          </MDTypography>
        )}
      </MDBox>
      <MDPagination variant="gradient" color="info">
        {filteredItems.currentPage > 0 && (
          <MDPagination item onClick={GoPrevPage}>
            <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
          </MDPagination>
        )}
        {renderPagination()}
        {filteredItems.currentPage < filteredItems.totalPages - 1 && (
          <MDPagination item onClick={GoNextPage}>
            <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
          </MDPagination>
        )}
      </MDPagination>
    </MDBox>
  );
}
export default Pagination;
