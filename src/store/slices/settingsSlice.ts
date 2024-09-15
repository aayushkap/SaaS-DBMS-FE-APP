import { createSlice } from "@reduxjs/toolkit";
import { settingsType } from "@/app/interfaces/users";

const initialState: settingsType = {
  activeToolTip: true,
  showSQLEditor: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleToolTip: (state) => {
      state.activeToolTip = !state.activeToolTip;
    },
    toggleSQLEditor: (state) => {
      state.showSQLEditor = !state.showSQLEditor;
    },
  },
});

export const { toggleToolTip, toggleSQLEditor } = settingsSlice.actions;
export default settingsSlice.reducer;
