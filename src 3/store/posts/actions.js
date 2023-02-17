import {
  GET_MASTER_DATA,
  GET_MASTER_DATA_SUCCESS,
  GET_MASTER_DATA_FAIL,
  GET_PARTY,
  GET_PARTY_SUCCESS,
  GET_PARTY_FAIL,
  GET_ITEM,
  GET_ITEM_SUCCESS,
  GET_ITEM_FAIL,
} from "./actionTypes";

export const getMasterData = () => {
  return {
    type: GET_MASTER_DATA
  };
};

export const getMasterDataSuccess = (masterData) => {
  return {
    type: GET_MASTER_DATA_SUCCESS,
    payload: masterData,
  };
};

export const getMasterDataFail = (error) => {
  return {
    type: GET_MASTER_DATA_FAIL,
    payload: error,
  };
};

export const getParty = (page, rowsPerPage) => {
  return {
    type: GET_PARTY,
    page: page,
    rowsPerPage: rowsPerPage
  };
};

export const getPartySuccess = (partyMasterData) => {
  return {
    type: GET_PARTY_SUCCESS,
    payload: partyMasterData,
  };
};

export const getPartyFail = (error) => {
  return {
    type: GET_PARTY_FAIL,
    payload: error,
  };
};

export const getItem = (page, rowsPerPage, types) => {
  return {
    type: GET_ITEM,
    page: page,
    rowsPerPage: rowsPerPage, 
    types:types
  };
};

export const getItemSuccess = (itemData) => {
  return {
    type: GET_ITEM_SUCCESS,
    payload: itemData,
  };
};

export const getItemFail = (error) => {
  return {
    type: GET_ITEM_FAIL,
    payload: error,
  };
};