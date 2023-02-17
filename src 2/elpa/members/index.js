/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState, useEffect, useCallback } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { Autocomplete, CircularProgress, debounce, TextField } from "@mui/material";
import moment from "moment";
import { CSVLink } from "react-csv";

// Material Dashboard 2 PRO React components
import MDInput from "../../components/MDInput";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 PRO React
import DashboardLayout from "../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../components/Navbars/DashboardNavbar";
import DataTable from "./DataTable";
import DefaultCell from "./DataTable/DefaultCell";
import MemberActionsCell from "./actionsCell";

import MemberEditor from "./MemberEditor";

import apiLinks from "../../global/apiLinks";
import Pagination from "../teams/Pagination";
import ChatDrawer from "./Chat";
import { deleteReq, get, loadList } from "../../services/request";

// "id": "6321ffa4a005531a40791d53",
// "team": "teamName",
// "firstName": "John",
// "lastName": "Doe",
// "membershipStart": "2022-09-14T16:21:56.492Z",
// "createdAt": "2022-09-14T16:21:56.492Z",
// "unionProvider": "ELPA",
// "serviceProvider": null,
// "player": false,
// "representative": true,
// "paid": true,

const headers = [
  { label: "ID", key: "id" },
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Membership Start", key: "membershipStart" },
  { label: "Union Provider", key: "unionProvider" },
  { label: "Paid", key: "paid" },
];

function MembersList() {
  const [chatMember, setChatMember] = useState(null);
  const [userForEditor, setUserForEditor] = useState(null);
  const [memberEditorStatus, setDataMemberEditor] = useState(""); // live
  const [memberEditorType, setCreatorOrEditor] = useState("creator");
  const [membersData, setMembersData] = useState(null);
  const [menu, setMenu] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const chatMemberClick = (userId) => {
    const user = membersData.members.find((el) => el.id === userId);
    setChatMember(user);
  };

  const renderBadge = (label, isPaid) => (
    <MDTypography
      fontWeight="regular"
      sx={{
        fontSize: 12,
        borderRadius: "40px",
        padding: "4px 8px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        flexGrow: 0,
        backgroundColor: isPaid ? "#caffdf" : "#fffaeb",
        border: `1px solid ${isPaid ? "#caffdf" : "#fffaeb"}`,
        color: `${isPaid ? "#6ae082" : "#f2c94c"} !important`,
        "& .dot": {
          height: "6px",
          width: "6px",
          backgroundColor: isPaid ? "#6ae082" : "#f2c94c",
          borderRadius: "50%",
          display: "inline-block",
        },
      }}
    >
      <span className="dot" />
      {label}
    </MDTypography>
  );

  const dataMembersColumns = [
    {
      Header: "date",
      accessor: "membershipStart",
      Cell: ({ value }) => {
        if (value === null) {
          return <DefaultCell value="Membership start date not set" />;
        }
        return <DefaultCell value={moment(value).format("MMM Do, YYYY")} />;
      },
    },
    {
      Header: "name",
      accessor: "firstName",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "surname",
      accessor: "lastName",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "status",
      accessor: "paid",
      Cell: ({ value }) => renderBadge(value ? "Paid" : "Unpaid", value),
    },
    // eslint-disable-next-line no-use-before-define
    {
      Header: "",
      align: "right",
      accessor: "id",
      Cell: ({ value }) => (
        <MemberActionsCell
          memberId={value}
          openUserEditor={openUserEditor}
          deleteMember={deleteMember}
          chatMember={chatMemberClick}
        />
      ),
    },
  ];

  const openModalForNewUser = () => {
    setCreatorOrEditor("creator");
    setDataMemberEditor("opened");
    setUserForEditor(null);
  };

  const openUserEditor = (userId) => {
    const user = membersData.members.find((el) => el.id === userId);
    setUserForEditor(user);
    setCreatorOrEditor("editor");
    setDataMemberEditor("opened");
  };

  const deleteMember = async (userId) => {
    if (window.confirm("Are you sure that you like to delete the user?")) {
      try {
        await deleteReq(`${apiLinks.deleteUser}${userId}`);
        getMembersData(0);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeModalForEditor = () => {
    setDataMemberEditor("");
  };

  const reloadTheMembersAfterEdit = () => {
    getMembersData(membersData.currentPage);
  };

  const getMembersData = (pageIndex) => {
    loadList(`${apiLinks.loadAllMembers}?page=${pageIndex}&size=10`, ({ data = {} }) => {
      if (data?.members) {
        setMembersData(data);
      }
      setIsLoading(false);
    });
  };

  const getMemberByStatus = (members = [], status) => {
    if (status === "paid") {
      return members.filter((m) => m.paid);
    }
    if (status === "unpaid") {
      return members.filter((m) => !m.paid);
    }
    return members;
  };

  const dataMembersTableData = useCallback(() => {
    const rowsData = membersData
      ? getMemberByStatus(membersData?.members, selectedFilter?.value)
      : [];

    return {
      columns: dataMembersColumns,
      rows: rowsData,
    };
  }, [membersData, selectedFilter]);

  const onSearchCallback = useCallback(
    debounce(async (val) => {
      setErrorMsg(null);
      setIsLoading(true);
      const valTrimmed = val.trim();
      try {
        if (valTrimmed.length > 0) {
          const { data } = await get(`${apiLinks.searchUser}${valTrimmed}`);
          console.log("search responded--", data);
        } else {
          getMembersData(0);
        }
      } catch (error) {
        console.log(error);
        if (valTrimmed.length > 0) {
          setErrorMsg(error.message || "Something went wrong!");
          setMembersData(null);
        }
      }
      setIsLoading(false);
    }, 300),
    []
  );

  const onChangeSearch = (evt) => {
    const { value } = evt.target;
    setSearchKey(value);
    onSearchCallback(value);
  };

  const onChangeFilter = (_, val) => {
    setSelectedFilter(val);
  };

  useEffect(() => {
    getMembersData(0);
  }, []);

  const goToPageTable = (pageIndex) => {
    getMembersData(pageIndex);
  };

  const goPrevPage = () => {
    getMembersData(membersData.currentPage - 1);
  };

  const goNextPage = () => {
    getMembersData(membersData.currentPage + 1);
  };

  const closeMenu = () => setMenu(null);

  const onCloseChat = () => {
    setChatMember(null);
  };

  const renderMenu = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem onClick={closeMenu}>Status: Paid</MenuItem>
      <MenuItem onClick={closeMenu}>Status: Refunded</MenuItem>
      <MenuItem onClick={closeMenu}>Status: Canceled</MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem onClick={closeMenu}>
        <MDTypography variant="button" color="error" fontWeight="regular">
          Remove Filter
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  const csvReport = {
    data: membersData?.members || [],
    headers,
    filename: `members_${moment().format("YYYYMMDD_HHMMSS")}.csv`,
  };

  return (
    <DashboardLayout>
      <ChatDrawer member={chatMember} onClose={onCloseChat} />
      <DashboardNavbar hideSearch />
      <MDBox my={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDBox>
            <MDButton variant="gradient" color="info" onClick={openModalForNewUser}>
              new member
            </MDButton>
            <MDInput
              style={{ marginLeft: "18px" }}
              value={searchKey}
              placeholder="Enter username"
              onChange={onChangeSearch}
              label="Search here"
            />
          </MDBox>

          <MDBox display="flex" alignItems="center">
            <MDBox style={{ minWidth: "150px" }}>
              <Autocomplete
                value={selectedFilter}
                options={[
                  { label: "Paid", value: "paid" },
                  { label: "Not Paid", value: "unpaid" },
                ]}
                onChange={onChangeFilter}
                renderInput={(params) => (
                  <TextField label="Filters" {...params} variant="standard" placeholder="Filter" />
                )}
              />
            </MDBox>
            {/* <MDButton variant={menu ? "contained" : "outlined"} color="dark" onClick={openMenu}>
              filters&nbsp;
              <Icon>keyboard_arrow_down</Icon>
            </MDButton> */}
            {renderMenu}
            <MDBox ml={1}>
              <CSVLink {...csvReport}>
                <MDButton variant="outlined" color="dark">
                  <Icon>description</Icon>
                  &nbsp;export csv
                </MDButton>
              </CSVLink>
            </MDBox>
          </MDBox>
        </MDBox>

        <Card className="members">
          {isLoading || errorMsg ? (
            <MDBox px={2} my={4} display="flex" justifyContent="center">
              {errorMsg ? (
                <MDTypography variant="button" fontWeight="regular" color="error">
                  {errorMsg}
                </MDTypography>
              ) : (
                <CircularProgress size={30} color="primary" />
              )}
            </MDBox>
          ) : (
            <>
              <DataTable
                table={dataMembersTableData()}
                entriesPerPage={false}
                OpenUserEditor={openUserEditor}
              />
              <Pagination
                filteredItems={membersData}
                goToPageTable={goToPageTable}
                GoPrevPage={goPrevPage}
                GoNextPage={goNextPage}
              />
            </>
          )}
        </Card>
      </MDBox>

      <MemberEditor
        memberEditorType={memberEditorType}
        id="member-creator"
        statusClass={memberEditorStatus}
        user={userForEditor}
        closeModalForEditor={closeModalForEditor}
        reloadTheMembersAfterEdit={reloadTheMembersAfterEdit}
      />
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default MembersList;
