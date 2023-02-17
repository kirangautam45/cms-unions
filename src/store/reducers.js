import { combineReducers } from "redux";

import MasterReducer from "./posts/reducer";

const rootReducer = combineReducers({
  MasterReducer,
});

export default rootReducer;
