import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Modal, Form, Button, Dropdown, Card } from 'react-bootstrap';
import { createBenefit, getBenefitData, deleteBenefit, updateBenefit } from '../../services/auth';
import Swal from 'sweetalert2';
import BenefitForm from '../component/form/BenefitForm';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';

const Benefits = () => {
  const [state, setState] = useState();
  const [openBenefitForm, setBenefitFormModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [benefitRequest, setBenefitRequest] = useState({
    benefitData: [],
    benefitInActiveData: [],
  });


  const handleBenefitForm = () => {
    setBenefitFormModal(true)
  }

  const handleCancelBenefitForm = () => {
    setBenefitFormModal(false)
  }

  const onFormSubmit = (formData, e) => {
    if (!isEdit) {
      addBenefit(formData, e)
    }
    else {
      editBenefit(formData, e)
    }
  }

  const editBenefitData = (row, e) => {
    setState({ rowData: row })
    setBenefitFormModal(true)
    setIsEdit(true);
  }

  const addBenefit = (formData, e) => {
    createBenefit({
      "title": formData['benefitTitle'],
      "description": formData['benefitDescription'],
      "active": formData['activityStatus']
    })
      .then((res) => {
        if (res.data && res.data.statusCode === 200) {
          if (res.data.response.active) {
            setBenefitRequest({
              ...benefitRequest,
              benefitData: [res.data.response, ...benefitRequest.benefitData],
            });
          } else {
            setBenefitRequest({
              ...benefitRequest,
              benefitInActiveData: [res.data.response, ...benefitRequest.benefitInActiveData],
            });
          }

          setBenefitFormModal(false);
          Swal.fire({
            text: "Benefits Created Successfully",
            icon: "success",
          });
          e.target.reset();
        }
        else {
          console.log("Benefits not create")
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      });
  }

  const editBenefit = (formData, e) => {
    updateBenefit({
      "title": formData['benefitTitle'],
      "description": formData['benefitDescription'],
      "active": formData['activityStatus']
    }, state.rowData['id'])
      .then((res) => {
        if (res.data && res.data.statusCode === 200) {
          getBenefitAllData()
          setBenefitFormModal(false);
          setIsEdit(false);
          setState({ rowData: [] })
          e.target.reset();
          Swal.fire({
            text: "Benefit Updated",
            icon: "success",
          });
        }
        else {
          console.log("Benefits not create")
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
      });
  }

  const getBenefitAllData = async () => {
    await getBenefitData()
      .then((res) => {
        if (res && res.data.response && res.data.statusCode === 200) {
          let activeData = [];
          let inActiveData = [];
          res.data.response.forEach(element => {
            if (element.active) {
              activeData.push(element)
            }
            else {
              inActiveData.push(element)
            }
          });
          setBenefitRequest({
            benefitData: activeData,
            benefitInActiveData: inActiveData,
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
  const deleteBenifitData = async (dt) => {
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
        await deleteBenefit(dt.id)
          .then(async (res) => {
            if (res) {
              var index = benefitRequest.benefitData.findIndex(function (o) {
                return o.id === dt.id;
              })
              if (index !== -1) {
                benefitRequest.benefitData.splice(index, 1);
                setBenefitRequest({
                  ...benefitRequest,
                  benefitData: benefitRequest.benefitData
                })
              }

              var index = benefitRequest.benefitInActiveData.findIndex(function (o) {
                return o.id === dt.id;
              })
              if (index !== -1) {
                benefitRequest.benefitInActiveData.splice(index, 1);
                setBenefitRequest({
                  ...benefitRequest,
                  benefitInActiveData: benefitRequest.benefitInActiveData
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

  const handleSearchBenefit = (e) => {
    const filter = e.target.value;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = benefitRequest.benefitData.filter(item => {
      delete item['active'];
      return Object.keys(item).some(key =>
        item[key].toLowerCase().includes(lowercasedFilter)
      );
    });
    console.log("filteredData", filteredData)
  }

  useEffect(() => {
    let abortController = new AbortController();
    getBenefitAllData()
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <React.Fragment>
      <div className="benefit">
        <div className="page-header d-flex justify-content-between">
          <div className="h-100 pl-4">
            <div className="title-border d-flex flex-column justify-content-center">
              <h3 className="page-title">Overview</h3>
            </div>
          </div>
          <div className="input-group p-2 mr-3 text-right" style={{ width: '367px' }}>
            <input className="form-control rounded-pill py-2 pr-5 mr-1 bg-transparent"
              type="search" placeholder="Search Benefits" onChange={(e) => handleSearchBenefit(e)} />
            <span className="input-group-append">
              <div className="input-group-text border-0 bg-transparent ml-n5">
                <i className="fa fa-search" aria-hidden="true"></i>
              </div>
            </span>
          </div>
        </div>
        <div className="mb-4 flex-row justify-content-between">
          <button className="btn btn-sm btn-primary mr-0 add-button" onClick={() => handleBenefitForm()}>
            <i className="mdi mdi-plus-circle-outline btn-icon-prepend mr-2"></i>
            Add New
          </button>
        </div>
        <div className='row benefit-card'>
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card border-round-8">
              <div className="card-body p-4">
                <h4 className="card-title mb-0">Benefit - Active</h4>
                <div className="mt-2">
                  <Accordion preExpanded={[0]} className="accordion accordion-bordered">
                    {benefitRequest.benefitData.length > 0 && benefitRequest.benefitData.map((row, i) => {
                      return (
                        <Card className="mb-0" key={i}>
                          <AccordionItem uuid={i}>
                            <AccordionItemHeading>
                              <AccordionItemButton className='accordion__button d-flex justify-content-between'>
                                <div className='card-header flex-grow-1'>{row.title}</div>
                                <Dropdown className="card-header mr-4">
                                  <Dropdown.Toggle as={CustomToggle}>
                                    <img src={require("../../assets/images/icon/dots-menu-horizontal.svg")} alt="dots_icon" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item className='mb-2' onClick={(e) => editBenefitData(row, e)}><img className='mr-2' alt="pencil_icon" src={require("../../assets/images/icon/pencil.svg")} />Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => deleteBenifitData(row, e)}><img className='mr-2' alt="delete-black_icon" src={require("../../assets/images/icon/delete-black.svg")} />Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel className='card-body'>
                              {row.description}
                              <div className="d-flex align-items-center justify-content-between mt-3 mb-2 activity">
                                <label htmlFor="privateSwitch" className='mb-0'>Active</label>
                                <Form.Check
                                  type="switch"
                                  id="privateSwitch"
                                  label=""
                                  checked={row.active ? true : false}
                                  disabled
                                  className="pl-0"
                                />
                              </div>
                            </AccordionItemPanel>
                          </AccordionItem>
                        </Card>

                      )
                    })}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card border-round-8">
              <div className="card-body p-4">
                <h4 className="card-title mb-0">Benefit - NonActive</h4>
                <div className="mt-2">
                  <Accordion preExpanded={[0]} className="accordion accordion-bordered">
                    {benefitRequest.benefitInActiveData.length > 0 && benefitRequest.benefitInActiveData.map((row, i) => {
                      return (
                        <Card className="mb-0" key={i}>
                          <AccordionItem uuid={i}>
                            <AccordionItemHeading>
                              <AccordionItemButton className='accordion__button d-flex justify-content-between'>
                                <div className='card-header flex-grow-1'>{row.title}</div>
                                <Dropdown className="card-header mr-4">
                                  <Dropdown.Toggle as={CustomToggle}>
                                    <img src={require("../../assets/images/icon/dots-menu-horizontal.svg")} alt="dots_icon" />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item className='mb-2' onClick={(e) => editBenefitData(row, e)}><img className='mr-2' alt="pencil_icon" src={require("../../assets/images/icon/pencil.svg")} />Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => deleteBenifitData(row, e)}><img className='mr-2' alt="delete-black_icon" src={require("../../assets/images/icon/delete-black.svg")} />Delete</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel className='card-body'>
                              {row.description}
                              <div className="d-flex align-items-center justify-content-between mt-3 mb-2 activity">
                                <label htmlFor="privateSwitch" className='mb-0'>Active</label>
                                <Form.Check
                                  type="switch"
                                  id="privateSwitch"
                                  label=""
                                  checked={row.active ? true : false}
                                  disabled
                                  className="pl-0"
                                />
                              </div>
                            </AccordionItemPanel>
                          </AccordionItem>
                        </Card>

                      )
                    })}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={openBenefitForm} onHide={handleCancelBenefitForm} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title className="primary-font h5">{isEdit ? "Update Benefit" : "Create Benefit"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEdit ?
            <BenefitForm
              isEdit={isEdit}
              rowData={state.rowData}
              onFormSubmit={onFormSubmit}
              handleCancelBenefitForm={handleCancelBenefitForm} />
            :
            <BenefitForm
              isEdit={isEdit}
              onFormSubmit={onFormSubmit}
              handleCancelBenefitForm={handleCancelBenefitForm} />}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default Benefits;
