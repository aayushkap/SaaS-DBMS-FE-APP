// This slice is to keep track of the actively shown table and database in the UI
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TableState {
  activeTable: string | null;
  activeDatabase: Record<string, any> | null; // General object type
  showingQueries: boolean;
}

const initialState: TableState = {
  activeTable: null,
  activeDatabase: null,
  showingQueries: false,
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
    setShowQueries: (state, action: PayloadAction<boolean>) => {
      console.log("Setting show queries to", action.payload);
      state.showingQueries = action.payload;
    },
  },
});

export const {
  setActiveTable,
  setActiveDatabase,
  clearActiveDatabase,
  setShowQueries,
} = tableSlice.actions;
export default tableSlice.reducer;
