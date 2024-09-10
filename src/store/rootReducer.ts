import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import settingsSlice from "./slices/settingsSlice";
import dialogSlice from "./slices/dialogSlice";

const rootReducer = combineReducers({
  user: userReducer,
  settings: settingsSlice,
  dialog: dialogSlice,
  // Add other slices here
});

export default rootReducer;
