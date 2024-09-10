// src/store/slices/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { userType } from "@/app/interfaces/users";

const initialState: userType = {
  username: "",
  email: "",
  isAdmin: false,
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      console.log("setUser Action called with:", action.payload); // Confirm action payload
      state.username = action.payload.name;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
