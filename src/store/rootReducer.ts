import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import settingsSlice from "./slices/settingsSlice";
import dialogSlice from "./slices/dialogSlice";
import connectionsSlice from "./slices/connectionsSlice";
import tableSlice from "./slices/tableSlice";

const rootReducer = combineReducers({
  user: userReducer,
  settings: settingsSlice,
  dialog: dialogSlice,
  connections: connectionsSlice,
  table: tableSlice,
  // Add other slices here
});

export default rootReducer;
