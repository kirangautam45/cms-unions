/* eslint-disable object-shorthand */
/* eslint-disable arrow-body-style */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, {
  // useEffect,
  useState,
} from "react";

import Divider from "@mui/material/Divider";
// import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

import apiLinks from "../../global/apiLinks";
import { updateAPI } from "../../services/request";

function BenefitItem({ benefitData, columnHolderType, fForUpdateBenefit, fForDeleteBenefit }) {
  const [data, setData] = useState(null);
  const getData = () => (data !== null ? data : benefitData);

  const [iAmDeleted, setIAmDeleted] = useState(false);
  const [menu, setMenu] = useState(null);
  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const menuItemBenefits = (
    <Menu
      anchorEl={menu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(menu)}
      onClose={closeMenu}
      keepMounted
    >
      <MenuItem
        onClick={() => {
          closeMenu();
          fForUpdateBenefit(getData());
        }}
      >
        <Icon>edit</Icon>&nbsp;Edit
      </MenuItem>
      <Divider sx={{ margin: "0.5rem 0" }} />
      <MenuItem
        onClick={() => {
          closeMenu();
          fForDeleteBenefit(getData());
        }}
      >
        <MDTypography variant="button" color="error" fontWeight="regular">
          <Icon>remove</Icon>&nbsp;Delete
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  const updateActivationStatus = (newActiveValue) => {
    console.log("benefit new status for update:", newActiveValue);
    updateAPI(apiLinks.updateBenefit, getData().id, { active: newActiveValue }, () => {});
  };

  // // console.log("lastItemThatHaveChangedTheActiveStatus:", lastItemThatHaveChangedTheActiveStatus);
  // this will be using just for checkbox
  // const [isStatusActiveChecked, setIsStatusActiveChecked] = useState(false);

  // on init is '', after that will be 'activated' 'deactivated'
  const STATUS_ACTIVATED = "activated";
  const STATUS_DEACTIVATED = "deactivated";
  const [activeStatus, setActiveStatus] = useState("");
  // const [imActive, setIAmActive] = useState(false);
  // console.log("isStatusActiveChecked:", isStatusActiveChecked, "benefitData.active:", benefitData.active, "imActive:", imActive, benefitData);

  const getStatus = () => {
    if (activeStatus !== "") return activeStatus;
    return getData().active ? STATUS_ACTIVATED : STATUS_DEACTIVATED;
  };

  console.log("getData:", getData(), getStatus(), activeStatus);

  const iAmHidden = () => {
    /* if(activeStatus!==''){
      return (columnHolderType==="activeColumn" && activeStatus===STATUS_DEACTIVATED) || (columnHolderType==="noneActiveColumn" && activeStatus===STATUS_ACTIVATED);
    }
    return (columnHolderType==="activeColumn" && !benefitData.active) || (columnHolderType==="noneActiveColumn" && benefitData.active); */

    return (
      (columnHolderType === "activeColumn" && getStatus() === STATUS_DEACTIVATED) ||
      (columnHolderType === "noneActiveColumn" && getStatus() === STATUS_ACTIVATED)
    );
  };

  const FOnAfterUpdateBenefit = (e) => {
    // // console.log("e:", e);
    const { benefitId, newData } = e.detail;
    if (getData().id === benefitId) {
      // document.getElementById(`title-${getId(columnHolderType)}`).innerHTML = newData.title;
      // document.getElementById(`description-${getId(columnHolderType)}`).innerHTML = newData.description;
      // newData().id = benefitId;
      console.log("newData:", newData);
      newData.id = benefitId;
      setData(newData);
    }
    // console.log(benefitId, newData);
  };
  const FOnAfterDeleteBenefit = (e) => {
    const { benefitId } = e.detail;
    if (getData().id === benefitId) {
      setIAmDeleted(true);
    }
  };
  const FBenefitOnStatusChanged = (e) => {
    console.log("FBenefitOnStatusChanged::::::");
    const { benefitId } = e.detail;
    if (getData().id === benefitId) {
      setActiveStatus(e.detail.newStatus);
    }
  };
  React.useEffect(() => {
    // document.addEventListener('specialEvent', handleChange);
    // window.addEventListener("OnHideAfterStatusChange", FOnHideAfterStatusChange);
    window.addEventListener("after-update-benefit", FOnAfterUpdateBenefit);
    window.addEventListener("on-delete-benefit", FOnAfterDeleteBenefit);
    window.addEventListener("onBenefitStatusChange", FBenefitOnStatusChanged);
    return () => {
      // document.removeEventListener('specialEvent', handleChange);
      // window.removeEventListener("OnHideAfterStatusChange", FOnHideAfterStatusChange);
      window.removeEventListener("after-update-benefit", FOnAfterUpdateBenefit);
      window.removeEventListener("on-delete-benefit", FOnAfterDeleteBenefit);
      window.removeEventListener("onBenefitStatusChange", FBenefitOnStatusChanged);
    };
  });

  const getId = (cType, additional = "") => {
    return `benefitItem-${cType}-${getData().id}${additional}`;
  };

  const [descriptionIsVisible, setDescriptionIsVisible] = useState(false);
  // console.log("descriptionIsVisible:", descriptionIsVisible);
  const ShowHideDescription = () => {
    setDescriptionIsVisible(!descriptionIsVisible);
  };

  // if((columnHolderType==="activeColumn" && !isStatusActiveChecked) || (columnHolderType==="noneActiveColumn" && isStatusActiveChecked))return null;
  if (iAmHidden()) return null;
  if (iAmDeleted) return null;
  return (
    // eslint-disable-next-line react/no-array-index-key
    <MDBox
      id={getId(columnHolderType)}
      className={`BenefitItem ${descriptionIsVisible ? "DescriptionIsOpened" : ""}`}
      pb={4}
    >
      <MDBox display="flex" alignItems="center" justifyContent="space-between">
        <MDBox>
          <MDTypography variant="h6" fontWeight="medium" id={`title-${getId(columnHolderType)}`}>
            {getData().title}
          </MDTypography>
        </MDBox>
        <MDBox>
          <MDButton
            className="benefitItemBtnShowDescription"
            variant="outlined"
            color="secondary"
            iconOnly
            onClick={() => {
              ShowHideDescription();
            }}
          >
            <Icon>keyboard_arrow_down</Icon>
          </MDButton>
          &nbsp;
          <MDButton variant="outlined" color="dark" iconOnly onClick={openMenu}>
            <Icon>more_horiz</Icon>
          </MDButton>
          {menuItemBenefits}
        </MDBox>
      </MDBox>

      <MDBox
        className={`BenefitDescription ${descriptionIsVisible ? "DescriptionIsOpened" : ""}`}
        id={getId(columnHolderType, "-description")}
        style={{ display: descriptionIsVisible ? "block" : "none" }}
      >
        <Divider />

        <MDTypography
          variant="h6"
          fontWeight="regular"
          id={`description-${getId(columnHolderType)}`}
        >
          {getData().description}
        </MDTypography>
        <Divider />

        <MDBox display="flex" alignItems="center" justifyContent="flex-end">
          <MDBox mr={1}>
            {/*
            <Switch checked={isStatusActiveChecked} onChange={()=>{ 
              setIsStatusActiveChecked(!isStatusActiveChecked); 
              updateActivationStatus();
              ShowOrHide();
            }} />
            */}

            <MDButton
              variant="contained"
              color="info"
              onClick={() => {
                // const stateFromOrigin = benefitData.active?STATUS_ACTIVATED:STATUS_DEACTIVATED;
                // const actualStatus = activeStatus!==''?activeStatus:stateFromOrigin;
                const newStatus =
                  getStatus() === STATUS_ACTIVATED ? STATUS_DEACTIVATED : STATUS_ACTIVATED;
                // update the status
                updateActivationStatus(getStatus() !== STATUS_ACTIVATED);
                // Dispatch event so benefit will show or hide on left/right columns
                dispatchEvent(
                  new CustomEvent("onBenefitStatusChange", {
                    detail: { benefitId: getData().id, newStatus },
                  })
                );
              }}
            >
              {getStatus() === STATUS_ACTIVATED ? "Deactivate" : "Activate"}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>

      <Divider />
    </MDBox>
  );
}
export default BenefitItem;
