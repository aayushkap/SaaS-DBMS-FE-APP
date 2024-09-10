// src/app/components/TestComponent.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";

import { setUser } from "@/store/slices/userSlice";
import { setSettings } from "@/store/slices/settingsSlice";

import { persistor } from "@/store/index";

export default function TestComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const settings = useSelector((state: RootState) => state.settings);

  const updateUser = () => {
    dispatch(setUser({ name: "aayushkap", email: "jane.doe@example.com" }));
  };

  const updateSettings = () => {
    dispatch(setSettings(!settings.activeToolTip));
  };

  return (
    <div>
      <p>Name: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Is Admin: {user.isAdmin ? "Yes" : "No"}</p>
      <p>Access Token: {user.accessToken}</p>
      <button onClick={updateUser}>Update User</button>

      <p>Active ToolTip: {settings.activeToolTip ? "Yes" : "No"}</p>
      <button onClick={updateSettings}>Update User</button>

      <button onClick={() => persistor.purge()}>Purge Persistor</button>
    </div>
  );
}
