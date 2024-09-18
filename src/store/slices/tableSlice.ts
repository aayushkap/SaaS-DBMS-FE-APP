// This slice is to keep track of the actively shown table and database in the UI
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TableState {
  activeTable: string | null;
  activeDatabase: Record<string, any> | null; // General object type
}

const initialState: TableState = {
  activeTable: null,
  activeDatabase: null,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setActiveDatabase: (state, action: PayloadAction<Record<string, any>>) => {
      state.activeDatabase = action.payload;
    },
    clearActiveDatabase: (state) => {
      state.activeDatabase = null;
      state.activeTable = null;
    },
    setActiveTable: (state, action: PayloadAction<string>) => {
      state.activeTable = action.payload;
    },
  },
});

export const { setActiveTable, setActiveDatabase, clearActiveDatabase } =
  tableSlice.actions;
export default tableSlice.reducer;
