import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";

export default function ManageConnectionsComp() {
  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

  return <div>hi</div>;
}
