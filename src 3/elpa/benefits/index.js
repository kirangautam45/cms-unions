/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import { Autocomplete, debounce } from "@mui/material";

import { createAPI, deleteReq, get, updateAPI, loadList } from "../../services/request";
import apiLinks from "../../global/apiLinks";
import DashboardLayout from "../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../components/Navbars/DashboardNavbar";

import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";

import DataTable from "./DataTable";
import DefaultCell from "./DataTable/DefaultCell";
import ActionsCell from "./actionCell";
import DescriptionCell from "./DataTable/DescriptionCell";
import AddEditBenefits from "./AddEditDialog";

const dataMembersColumns = ({ onEdit, onDelete }) => [
  {
    Header: "Benefit Title",
    accessor: "title",
    Cell: ({ value }) => {
      return <DefaultCell value={value} />;
    },
  },
  {
    Header: "Description",
    accessor: "description",
    Cell: ({ row }) => <DescriptionCell ellipsisLength={150} data={row.values} />,
  },

  {
    Header: "Status",
    accessor: "active",
    Cell: ({ value }) => {
      if (value === true) {
        return <DefaultCell value="Active" />;
      }
      return <DefaultCell value="Not Active" />;
    },
  },
  {
    Header: "",
    width: "50px",
    accessor: "id",
    Cell: ({ row }) => <ActionsCell data={row.values} onEdit={onEdit} onDelete={onDelete} />,
  },
];

function Benefits() {
  const [searchKey, setSearchKey] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [apiState, setApiState] = useState({
    isLoading: true,
    isUpdating: false,
    isDeleting: false,
    isCreating: false,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  });

  const [isEditMode, setEditMode] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [selectedData, setSelectedData] = useState({});

  const fAfterLoaded = ({ data = {} }) => {
    const { benefits = [], currentPage, totalPages, totalItems } = data;
    setPagination({
      ...pagination,
      currentPage: currentPage || pagination.currentPage,
      totalPages: totalPages || pagination.currentPage,
      totalItems: totalItems || pagination.totalItems,
    });

    const formattedData = benefits.map((item) => {
      return {
        id: item?.id,
        title: item?.title,
        description: item?.description,
        active: item?.active,
      };
    });

    setAllData(formattedData);

    setApiState({
      ...apiState,
      isLoading: false,
    });
  };

  const fetchAll = (value) => {
    setApiState({
      ...apiState,
      isLoading: true,
    });
    loadList(
      apiLinks.benefitsAll(value || pagination.currentPage, pagination.pageSize),
      fAfterLoaded
    );
  };

  const onChangeFilter = (_, val) => {
    setSelectedFilter(val);
  };

  const onSearchCallback = useCallback(
    debounce(async (val) => {
      setApiState((s) => ({ ...s, isLoading: true }));
      const valTrimmed = val.trim();
      try {
        if (valTrimmed.length > 0) {
          const { data = [] } = await get(`${apiLinks.searchBenefit}${valTrimmed}`);
          setAllData(data);
        } else {
          fetchAll();
        }
      } catch (error) {
        console.log(error);
      }
      setApiState((s) => ({ ...s, isLoading: false }));
    }, 300),
    []
  );

  const onChangeSearch = (evt) => {
    const { value } = evt.target;
    setSearchKey(value);
    onSearchCallback(value);
  };

  const fAfterCreate = () => {
    setApiState({
      ...apiState,
      isCreating: false,
    });
    setDialogOpen(false);
    fetchAll();
  };

  const fAfterEdit = () => {
    setApiState({
      ...apiState,
      isUpdating: false,
    });

    setDialogOpen(false);
    fetchAll();
  };

  const deleteData = async (id) => {
    setApiState({
      ...apiState,
      isDeleting: true,
    });
    try {
      await deleteReq(`${apiLinks.deleteBenefit}${id}`);
      fetchAll();
    } catch (error) {
      console.log(error);
    }
    setApiState({
      ...apiState,
      isDeleting: false,
    });
  };

  const createData = (data) => {
    setApiState({
      ...apiState,
      isCreating: true,
    });
    createAPI(apiLinks.createBenefit, data, fAfterCreate);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpen = () => {
    setSelectedData({});
    setDialogOpen(true);
  };

  const handleEdit = (data) => {
    setEditMode(true);
    handleOpen();
    setSelectedData(data);
  };

  const handleDelete = (data) => {
    deleteData(data.id);
  };

  const handleCreate = (data) => {
    if (isEditMode) {
      setApiState({
        ...apiState,
        isCreating: true,
      });
      updateAPI(apiLinks.updateBenefit, data.id, data, fAfterEdit);
    } else {
      createData(data);
    }
  };

  const handleClose = () => {
    setSelectedData({});
    setEditMode(false);
    setDialogOpen(false);
  };

  const handlePagination = (_, value) => {
    setPagination({
      ...pagination,
      currentPage: value,
    });
    fetchAll(value);
  };

  const getRowsData = useCallback(() => {
    let result = allData;
    if (selectedFilter) {
      if (selectedFilter.value === "active") {
        result = allData.filter((item) => item.active);
      }
      if (selectedFilter.value === "inactive") {
        result = allData.filter((item) => !item.active);
      }
    }
    return result;
  }, [allData, selectedFilter]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDBox>
            <MDButton variant="gradient" color="info" onClick={handleOpen}>
              New Benefit
            </MDButton>
            <MDInput
              style={{ marginLeft: "18px" }}
              label="Search here"
              placeholder="Search benefits"
              value={searchKey}
              onChange={onChangeSearch}
            />
          </MDBox>

          <MDBox display="flex" alignItems="center">
            <MDBox style={{ minWidth: "150px" }}>
              <Autocomplete
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                onChange={onChangeFilter}
                value={selectedFilter}
                renderInput={(params) => (
                  <MDInput
                    variant="outlined"
                    label="Filters"
                    {...params}
                    value={selectedFilter?.value || ""}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </MDBox>
          </MDBox>
        </MDBox>

        <Card>
          {/* DataTable is custom component */}
          <DataTable
            isSorted={false}
            table={{
              columns: dataMembersColumns({ onEdit: handleEdit, onDelete: handleDelete }),
              rows: getRowsData(),
            }}
            entriesPerPage={false}
          />
          {pagination.totalItems > 10 && (
            <MDBox display="flex" width="100%" justifyContent="flex-end">
              <Pagination
                style={{ marginBottom: "20px" }}
                count={pagination.totalPages}
                page={pagination.currentPageNumber}
                onChange={handlePagination}
              />
            </MDBox>
          )}
        </Card>
      </MDBox>

      {isDialogOpen && (
        <AddEditBenefits
          isLoading={apiState.isCreating || apiState.isUpdating}
          data={selectedData}
          onCancel={handleClose}
          onSave={handleCreate}
          isEditMode={isEditMode}
        />
      )}
    </DashboardLayout>
  );
}

export default Benefits;
