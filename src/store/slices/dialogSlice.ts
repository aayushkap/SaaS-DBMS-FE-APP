// src/redux/dialogSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

interface DialogState {
  isOpen: boolean;
  content: ReactNode | null;
}

const initialState: DialogState = {
  isOpen: false,
  content: null,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<ReactNode>) => {
      state.isOpen = true;
      state.content = action.payload;
    },
    closeDialog: (state) => {
      state.isOpen = false;
      state.content = null;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
