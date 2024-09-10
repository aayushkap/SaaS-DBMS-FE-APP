import { createSlice } from "@reduxjs/toolkit";
import { settingsType } from "@/app/interfaces/users";

const initialState: settingsType = {
  activeToolTip: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, action) {
      console.log("setSettings Action called with:", action.payload); // Confirm action payload
      state.activeToolTip = action.payload;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
