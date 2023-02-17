/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";

import DashboardLayout from "elpa/components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "elpa/components/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import apiLinks from "../../global/apiLinks";
import { deleteReq, loadList } from "../../services/request";

import CategoryDetails from "./CategoryDetails";
import AddCategoryDialog from "./components/AddCategoryDialog";

import CategoryCard from "./components/CategoryCard";

function ElpaFAQ() {
  const { categoryId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [fetchNewData, setFetchNewData] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onEditCategory = (item) => {
    setOpenAddCategory(true);
    setSelectedCategory(item);
  };

  const onDeleteCategory = async (item) => {
    try {
      await deleteReq(`${apiLinks.deleteFAQCategory}${item.id}`);
      setFetchNewData(true);
    } catch (error) {
      console.log("---error", error);
    }
  };

  const loadCategories = async (page = pagination.currentPage) => {
    try {
      setIsLoading(true);
      loadList(apiLinks.loadFAQCategories(page - 1), ({ data = {} }) => {
        const { faqCategories = [], totalPages, totalItems } = data;
        setCategories(faqCategories);
        setIsLoading(false);
        setPagination({
          ...pagination,
          currentPage: page,
          totalPages: totalPages || 1,
          totalItems: totalItems || 0,
        });
      });
    } catch (error) {
      setIsLoading(false);
    }
    setFetchNewData(false);
  };

  const handlePagination = (_, page) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });
    loadCategories(page);
  };

  useEffect(() => {
    if (fetchNewData || !categoryId) {
      loadCategories();
    }
  }, [fetchNewData, categoryId]);

  const onCreateNewCategory = () => {
    setOpenAddCategory(true);
  };

  const onCloseDialog = (shouldRefresh = false) => {
    if (shouldRefresh) {
      setFetchNewData(true);
    }
    setOpenAddCategory(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <AddCategoryDialog
        isOpen={openAddCategory}
        isEdit={!!selectedCategory}
        currentCategory={selectedCategory}
        onClose={onCloseDialog}
      />
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox my={2}>
          {isLoading ? (
            <MDBox p={2} mt={4} display="flex" justifyContent="center">
              <CircularProgress size={30} color="primary" />
            </MDBox>
          ) : (
            <>
              {!categoryId ? (
                <>
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <MDButton variant="contained" color="warning" onClick={onCreateNewCategory}>
                      <Icon>add_circle</Icon>&nbsp;Add New Category
                    </MDButton>
                  </MDBox>
                  <MDBox py={1} style={{ overflowX: "auto" }}>
                    {categories.length > 0 ? (
                      <>
                        <Grid container spacing={3} wrap="wrap">
                          {categories.map((item) => (
                            <Grid item xs={6} md={3} lg={4} key={item.id}>
                              <CategoryCard
                                data={item}
                                onEdit={onEditCategory}
                                onDelete={onDeleteCategory}
                              />
                            </Grid>
                          ))}
                        </Grid>
                        {pagination.totalItems > 10 && (
                          <MDBox display="flex" width="100%" justifyContent="flex-end">
                            <Pagination
                              style={{
                                marginTop: "20px",
                              }}
                              count={pagination.totalPages}
                              page={pagination.currentPage}
                              onChange={handlePagination}
                            />
                          </MDBox>
                        )}
                      </>
                    ) : (
                      <MDBox p={2} display="flex" justifyContent="center">
                        <MDTypography variant="button" color="text">
                          There is no item
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </>
              ) : (
                <MDBox p={2}>
                  <CategoryDetails categoryId={categoryId} />
                </MDBox>
              )}
            </>
          )}
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default ElpaFAQ;
