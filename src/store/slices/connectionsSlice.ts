// This slice is to keep track of all available connections in the UI
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type
interface ConnectionState {
  connections: Record<string, any>[]; // Array of dictionaries
}

const initialState: ConnectionState = {
  connections: [],
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<Record<string, any>[]>) => {
      state.connections = action.payload;
    },
    addConnection: (state, action: PayloadAction<Record<string, any>>) => {
      state.connections.push(action.payload);
    },
  },
});

export const { setConnections, addConnection } = connectionsSlice.actions;
export default connectionsSlice.reducer;
