import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

import MDButton from "components/MDButton";
import MDBox from "../../components/MDBox";

import apiLinks from "../../global/apiLinks";
import { deleteReq, loadList } from "../../services/request";
import MDTypography from "../../components/MDTypography";
import FAQCard from "./components/FAQCard";
import AddFAQDialog from "./components/AddFAQDialog";

function CategoryDetails({ categoryId }) {
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [openAddFAQ, setOpenAddFAQ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    id: 0,
    name: "",
  });
  const [faqList, setFAQList] = useState([]);

  const onCreateFAQ = () => {
    setOpenAddFAQ(true);
  };

  const fetchCategoryData = () => {
    setIsLoading(true);
    loadList(apiLinks.loadFAQCategoryById(categoryId), ({ data }) => {
      if (data) {
        setCategoryData(data);
      }
      setIsLoading(false);
    });
  };

  const fetchFAQData = () => {
    setIsLoading(true);
    loadList(apiLinks.loadFAQByCategoryId(categoryId), ({ data = {} }) => {
      setIsLoading(false);
      setFAQList(data?.faq || []);
    });
  };

  const onDeleteFAQClick = async (item) => {
    try {
      await deleteReq(`${apiLinks.deleteFAQById}${item.id}/${item.categoryId}`);
      fetchFAQData();
    } catch (error) {
      console.log(error);
    }
  };

  const onEditFAQClick = (item) => {
    setOpenAddFAQ(true);
    setSelectedFAQ(item);
  };

  const onCloseDialog = (shouldRefresh = false) => {
    if (shouldRefresh) {
      fetchFAQData(true);
    }
    setOpenAddFAQ(false);
    setSelectedFAQ(null);
  };

  useEffect(() => {
    fetchCategoryData();
    fetchFAQData();
  }, []);

  return (
    <>
      <AddFAQDialog
        isOpen={openAddFAQ}
        isEdit={!!selectedFAQ}
        onClose={onCloseDialog}
        faqItem={selectedFAQ}
        selectedCategoryId={categoryId}
      />
      <MDBox>
        {isLoading ? (
          <MDBox p={2} mt={4} display="flex" justifyContent="center">
            <CircularProgress size={30} color="primary" />
          </MDBox>
        ) : (
          <>
            <MDBox display="flex" justifyContent="space-between" mb={3}>
              <MDTypography variant="h3" color="text" fontWeight="bold" mb={2}>
                {categoryData.name}
              </MDTypography>
              <MDButton
                variant="contained"
                color="warning"
                onClick={onCreateFAQ}
                sx={{ height: 5 }}
              >
                <Icon>add_circle</Icon>&nbsp;Add New FAQ
              </MDButton>
            </MDBox>
            {faqList.length > 0 ? (
              <Grid container spacing={2}>
                {faqList.map((item) => (
                  <Grid item xs={12} md={6} lg={4} key={item.id} sx={{ pt: "0px !important" }}>
                    <MDBox>
                      <FAQCard item={item} onEdit={onEditFAQClick} onDelete={onDeleteFAQClick} />
                    </MDBox>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <MDBox p={2} display="flex" justifyContent="center">
                <MDTypography variant="button" color="text">
                  There is no item
                </MDTypography>
              </MDBox>
            )}
          </>
        )}
      </MDBox>
    </>
  );
}

CategoryDetails.propTypes = {
  categoryId: PropTypes.string.isRequired,
};

export default CategoryDetails;
