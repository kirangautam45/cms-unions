import {
  GET_PARTY,
  GET_PARTY_SUCCESS,
  GET_PARTY_FAIL,
  GET_ITEM,
  GET_ITEM_SUCCESS,
  GET_ITEM_FAIL,
  GET_MASTER_DATA,
  GET_MASTER_DATA_SUCCESS,
  GET_MASTER_DATA_FAIL,
} from "./actionTypes";

const initialState = {
  partyMasterData: [],
  itemData: [],
  masterData: [],
  loadingPartyData: false,
  loadingItemData: false,
  error: {
    message: "",
  },
};

const MasterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MASTER_DATA:
      state = { ...state, loadingPartyData: true };
      break;
    case GET_MASTER_DATA_SUCCESS:
      state = { ...state, masterData: action.payload, loadingPartyData: false };
      break;
    case GET_MASTER_DATA_FAIL:
      state = {
        ...state,
        error: {
          message: "Error",
        },
        loadingPartyData: false,
      };
      break;
    case GET_PARTY:
      state = { ...state, page: action.page, rowsPerPage: action.rowsPerPage, loadingPartyData: true };
      break;
    case GET_PARTY_SUCCESS:
      state = { ...state, partyMasterData: action.payload, loadingPartyData: false };
      break;
    case GET_PARTY_FAIL:
      state = {
        ...state,
        error: {
          message: "Error",
        },
        loadingPartyData: false,
      };
      break;
    case GET_ITEM:
      state = { ...state, page: action.page, rowsPerPage: action.rowsPerPage, type: action.type, loadingItemData: true };
      break;
    case GET_ITEM_SUCCESS:
      state = { ...state, itemData: action.payload, loadingItemData: false };
      break;
    case GET_ITEM_FAIL:
      state = {
        ...state,
        error: {
          message: "Error",
        },
        loadingItemData: false,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default MasterReducer;
