import React, { useState } from "react";
import styles from "./ConnectionControl.module.scss";
import ToolTip from "@/app/components/ToolTip/ToolTip";
import { BsDatabaseFillAdd, BsDatabaseFillGear } from "react-icons/bs";

import { openDialog } from "@/store/slices/dialogSlice";

import { useQuery } from "@tanstack/react-query";
import { testConnection } from "@/app/api/query";
import { useMutation } from "@tanstack/react-query"; // For react-query v4

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { addConnection } from "@/store/slices/connectionsSlice";

import AddConnectionComp from "@/app/components/AddConnectionComp/AddConnectionComp";
import ManageConnectionsComp from "../ManageConnectionsComp/ManageConnectionsComp";

export default function ConnectionControl() {
  const dispatch = useDispatch();

  // Wrap the component in a function so it gets called when needed
  const handleOpenDialog = (content: JSX.Element) => () => {
    dispatch(
      openDialog(
        <div>
          <div>{content}</div>
        </div>
      )
    );
  };

  return (
    <div className={styles.connectionButtons}>
      <ToolTip message="Add Connection">
        <button
          className={styles.connectionButton}
          onClick={handleOpenDialog(<AddConnectionComp />)}
        >
          <BsDatabaseFillAdd className={styles.connectionIcon} size={25} />
        </button>
      </ToolTip>
      <ToolTip message="Manage Connections">
        <button
          className={styles.connectionButton}
          onClick={handleOpenDialog(<ManageConnectionsComp />)}
        >
          <BsDatabaseFillGear className={styles.connectionIcon} size={25} />
        </button>
      </ToolTip>
    </div>
  );
}
