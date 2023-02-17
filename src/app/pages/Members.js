import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Dropdown, Card } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import Swal from 'sweetalert2';
import { createMembers, deleteMembers, getMembersData, updateMembers } from "../../services/auth";
import MembersForm from "../component/form/MembersForm";

import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

const { ExportCSVButton } = CSVExport;

export default function Members() {
  const [startDate, setStartDate] = useState(new Date());
  const [openMembersForm, setMembersFormModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [state, setState] = useState();

  const [membersRequest, setMembersRequest] = useState({
    membersData: []
  });
  const columns = [{
    dataField: 'becomeMember',
    text: 'Date',
    sort: true,
    formatter: dateFormatter
  }, {
    dataField: 'firstName',
    text: 'Name',
    sort: true
  }, {
    dataField: 'lastName',
    text: 'Surname',
    sort: true
  }, {
    dataField: 'paid',
    text: 'Status',
    sort: true,
    formatter: buttonFormatter,
    formatExtraData: {
      true: 'badge badge-success',
      false: 'badge badge-warning'
    }
  }, {
    dataField: '',
    text: '',
    formatter: customFormatter,
  }
  ];
  const handleMembersForm = () => {
    setMembersFormModal(true)
  }

  const handleCancelMembersForm = () => {
    setMembersFormModal(false)
    setIsEdit(false);
    setState({ rowData: [] })
  }
  function dateFormatter(cell, row, rowIndex, formatExtraData) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var date = new Date(cell).toLocaleDateString("en-US", options);
    return date;
  }
  const selectRow = {
    mode: 'radio',
    hideSelectColumn: true,
    style: { background: "#FBD0B5" },
    clickToSelect: true
  };
  function buttonFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <span className={formatExtraData[cell]}><span className="dot"></span>{cell ? "Paid" : "Unpaid"}</span>
    );
  }
  function customFormatter(cell, row) {
    return (
      <div className="d-flex flex-row gap-2">
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <img src={require("../../assets/images/icon/dots-menu-horizontal.svg")} alt="dots_icon" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={(e) => editMembersData(row)} className='mb-2'><img className='mr-2' alt="pencil_icon" src={require("../../assets/images/icon/pencil.svg")} />Edit</Dropdown.Item>
            <Dropdown.Item onClick={(e) => deleteMemberData(row.id)}><img className='mr-2' alt="delete-black_icon" src={require("../../assets/images/icon/delete-black.svg")} />Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <a href="#" className="ml-2">
          <img src={require("../../assets/images/icon/chat.svg")} alt="chat_icon" />
        </a>
      </div>
    );
  }
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      className="seconary-font"
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {/* Render custom icon here */}
      {children}
    </a>
  ));

  const onFormSubmit = (formData, e) => {
    formData['becomeMember'] = startDate ? startDate : new Date();
    formData['player'] = false;
    console.log("formDataMembers", formData)
    if (!isEdit) {
      addMembers(formData, e)
    }
    else {
      editMembers(formData, e)
    }
  }

  const addMembers = (formData, e) => {
    createMembers(formData)
      .then((res) => {
        console.log("res___", res)
        if (res.data && res.data.statusCode === 200) {
          setMembersRequest({
            ...membersRequest,
            membersData: [res.data.response, ...membersRequest.membersData],
          });

          setMembersFormModal(false);
          Swal.fire({
            text: "Member Created Successfully",
            icon: "success",
          });
          e.target.reset();
        }
        else {
          console.log("Member not create")
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      });
  }
  const editMembersData = (row, e) => {
    setState({ rowData: row })
    setMembersFormModal(true)
    setIsEdit(true);
  }

  const editMembers = (formData, e) => {
    updateMembers(formData, state.rowData['id'])
      .then((res) => {
        if (res.data && res.data.statusCode === 200) {
          membersRequest.membersData.splice(membersRequest.membersData.indexOf(state.rowData && state.rowData), 1, res.data.response);
          setMembersFormModal(false);
          setIsEdit(false);
          setState({ rowData: [] })
          e.target.reset();
          Swal.fire({
            text: "Member Updated",
            icon: "success",
          });
        }
        else {
          console.log("Benefits not update")
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      });
  }

  const deleteMemberData = async (dt) => {
    console.log("delete", dt)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteMembers(dt)
          .then(async (res) => {
            if (res) {
              var index = membersRequest.membersData.findIndex(function (o) {
                return o.id === dt;
              })
              if (index !== -1) {
                membersRequest.membersData.splice(index, 1);
                setMembersRequest({
                  ...membersRequest,
                  membersData: membersRequest.membersData
                })
              }
              Swal.fire(
                'Deleted!',
                'Your data has been deleted.',
                'success'
              )
            }
          })
          .catch((err) => {
            if ((err && err.response && err.response.data) || (err && err.message)) {
              let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
              console.log("message", msg)
            }
          });
      }
    })
  }

  const getMembersAllData = async () => {
    await getMembersData()
      .then((res) => {
        if (res && res.data.response && res.data.statusCode === 200) {
          setMembersRequest({
            membersData: [...membersRequest.membersData, ...res.data.response],
          });
        }
      })
      .catch((err) => {
        if ((err && err.response && err.response.data) || (err && err.message)) {
          let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
          console.log("message", msg)
        }
      });
  };

  useEffect(() => {
    let abortController = new AbortController();
    getMembersAllData()
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <React.Fragment>
      <div className="members">
        <div className="page-header d-flex justify-content-between">
          <div className="h-100 pl-4">
            <div className="title-border d-flex flex-column justify-content-center">
              <h3 className="page-title">Overview</h3>
            </div>
          </div>
          <div className="input-group p-2 mr-3 text-right" style={{ width: '367px' }}>
            <input className="form-control rounded-pill py-2 pr-5 mr-1 bg-transparent"
              type="search" placeholder="Search Members" />
            <span className="input-group-append">
              <div className="input-group-text border-0 bg-transparent ml-n5">
                <i className="fa fa-search" aria-hidden="true"></i>
              </div>
            </span>
          </div>
        </div>
        <div className="row members-table">
          <div className="col-12 border-rounded-8 grid-margin stretch-card">
            <div className="card">
              <ToolkitProvider
                keyField="id"
                data={membersRequest.membersData}
                columns={columns}
                exportCSV
              >
                {
                  props => (
                    <div className="card-body">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <h4 className="card-title mb-0">Members</h4>
                        <div className="d-flex flex-row mr-3">
                          <button className="btn btn-sm btn-outline-secondary btn-group">
                            Last 30 days
                          </button>
                          <div className="divider"></div>
                          <ExportCSVButton className="btn btn-sm btn-outline-secondary btn-group" {...props.csvProps}>Download</ExportCSVButton>
                          <button className="btn btn-sm btn-primary mr-0 add-button" onClick={() => handleMembersForm()}>
                            <i className="mdi mdi-plus-circle-outline btn-icon-prepend mr-2"></i>
                            Add New
                          </button>
                        </div>
                      </div>
                      <BootstrapTable {...props.baseProps} bootstrap4 selectRow={selectRow} bordered={false} />
                    </div>
                  )
                }
              </ToolkitProvider>
            </div>
          </div>
        </div>
      </div>
      <Modal show={openMembersForm} onHide={handleCancelMembersForm} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title className="primary-font h5">{isEdit ? "Update Member" : "Add New Member"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEdit ?
            <MembersForm
              isEdit={isEdit}
              rowData={state.rowData}
              startDate={startDate}
              setStartDate={setStartDate}
              onFormSubmit={onFormSubmit}
              handleCancelMembersForm={handleCancelMembersForm} />
            :
            <MembersForm
              isEdit={isEdit}
              startDate={startDate}
              setStartDate={setStartDate}
              onFormSubmit={onFormSubmit}
              handleCancelMembersForm={handleCancelMembersForm} />}
        </Modal.Body>
      </Modal>
    </React.Fragment>


  )
}
