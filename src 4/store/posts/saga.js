import { takeLatest, put, call } from "redux-saga/effects";

import { GET_PARTY, GET_ITEM, GET_MASTER_DATA } from "./actionTypes";

import {
  getPartySuccess,
  getPartyFail,
  getItemSuccess,
  getItemFail,
  getMasterDataSuccess,
  getMasterDataFail,
} from "./actions";

import { getParty, getItem, getMasterData } from "../../helpers/backend_helper";

function* onGetMasterData() {
  try {
    const response = yield call(getMasterData);
    yield put(getMasterDataSuccess(response.data.data));
  } catch (error) {
    yield put(getMasterDataFail(error.response));
  }
}

function* onGetParty({ page, rowsPerPage }) {
  try {
    const response = yield call(getParty, page, rowsPerPage);
    yield put(getPartySuccess(response.data.data));
  } catch (error) {
    yield put(getPartyFail(error.response));
  }
}

function* onGetItem({ page, rowsPerPage, types }) {
  try {
    const response = yield call(getItem, page, rowsPerPage, types);
    yield put(getItemSuccess(response.data.data));
  } catch (error) {
    yield put(getItemFail(error.response));
  }
}


function* CartSaga() {
  yield takeLatest(GET_MASTER_DATA, onGetMasterData);
  yield takeLatest(GET_PARTY, onGetParty);
  yield takeLatest(GET_ITEM, onGetItem);
}

export default CartSaga;
