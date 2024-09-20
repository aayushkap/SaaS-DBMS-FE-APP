import React, { useState } from "react";
import styles from "./TableCell.module.scss";

import { FiRefreshCcw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import Dropdown from "../Dropdown/Dropdown";

import DynamicTable from "../TableComp/TableComp";
import { IoMdSettings } from "react-icons/io";
import { toggleSQLEditor } from "@/store/slices/settingsSlice";
import { testConnection } from "@/app/api/query";
import { useMutation } from "@tanstack/react-query";
import { setConnections } from "@/store/slices/connectionsSlice";
import { setActiveTable, setActiveDatabase } from "@/store/slices/tableSlice";
import { openDialog } from "@/store/slices/dialogSlice";
import { SiTicktick } from "react-icons/si";
import { useTestConnectionMutation } from "@/app/helper/genericMutations";

export default function TableCell() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cellSize, setCellSize] = useState("medium");
  const [showCellBorders, setShowCellBorders] = useState(true);
  const [textAlignment, setTextAlignment] = useState("center");

  const dispatch = useDispatch();

  const handleOpenDialog = (content: JSX.Element) => () => {
    dispatch(
      openDialog(
        <div>
          <div>{content}</div>
        </div>
      )
    );
  };

  // Selectors for getting state values
  const activeTable = useSelector(
    (state: RootState) => state.table.activeTable
  );

  const activeDatabase = useSelector(
    (state: RootState) => state.table.activeDatabase
  );

  const tableNames = Object.keys(activeDatabase?.tables ?? {});

  // Check if activeTable is not null before accessing tableValues
  const tableValues = activeTable
    ? activeDatabase?.tables?.[activeTable]?.sample_data ?? []
    : [];

  const columns = activeTable
    ? activeDatabase?.tables?.[activeTable]?.column_info
    : [];

  // Function to handle table selection
  function handleTableSelect(tableName: string) {
    dispatch(setActiveTable(tableName)); // Dispatch action to set the active table
  }

  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

  // const testConnectionMutation = useMutation({
  //   mutationFn: testConnection,
  //   onSuccess: (data) => {
  //     if (data?.SUCCESS) {
  //       console.log("data", data);

  //       // Find the matching connection in the Redux store
  //       const connectionIndex = connections.findIndex(
  //         (connection) =>
  //           JSON.stringify(connection.params) === JSON.stringify(data.params)
  //       );

  //       if (connectionIndex !== -1) {
  //         // Clone connections array to avoid mutating state directly
  //         const updatedConnections = [...connections];
  //         // Replace the matching connection with the new one from the API response
  //         updatedConnections[connectionIndex] = data;

  //         // Dispatch updated connections to Redux
  //         dispatch(setConnections(updatedConnections));

  //         if (data?.DATABASE_INFO) {
  //           dispatch(setActiveDatabase(data.DATABASE_INFO));
  //         }

  //         console.log("Connection updated successfully.");
  //         handleOpenDialog(
  //           <div className={styles.dialog}>
  //             <SiTicktick size={30} color="green" />
  //             <>Refresh successful!</>
  //           </div>
  //         )();
  //         return true; // Return true if update is successful
  //       } else {
  //         console.log("No matching connection found.");
  //         handleOpenDialog(<div>No matching connection found.</div>)();
  //         return false; // Return false if no matching connection is found
  //       }
  //     } else {
  //       console.log("Query failed.");
  //       handleOpenDialog(<div>Connection Error.</div>)();
  //       return false; // Return false if API call is unsuccessful
  //     }
  //   },
  //   onError: (e) => {
  //     console.log(`Error connecting to database: ${e.toString()}`);
  //     handleOpenDialog(
  //       <div>Error connecting to database: {e.toString()}</div>
  //     )();
  //     return false; // Return false if there's an error
  //   },
  // });

  const {
    mutate: testConnection,
    isPending: isTestConnectionPending,
    isError,
    isSuccess,
    error,
    data,
  } = useTestConnectionMutation();

  const handleReconnect = () => {
    console.log("Reconnecting...");

    const credentials = {
      database_type: activeDatabase?.type,
      params: activeDatabase?.params,
    };

    testConnection(credentials, {
      onSuccess: (data) => {
        console.log("Reconnection successful. Data:", data);
        handleOpenDialog(
          <div className={styles.dialog}>
            <SiTicktick size={30} color="green" />
            <>Refresh successful!</>
          </div>
        )();
      },
      onError: (error) => {
        console.log("Reconnection failed. Error:", error);
        handleOpenDialog(
          <div className={styles.dialog}>
            <>Error connecting to database: {error.toString()}</>
          </div>
        )();
      },
    });
  };
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tableInfo}>
          <div className={styles.tableName}>
            <FiRefreshCcw
              className={`${styles.icon} ${
                isTestConnectionPending ? styles.active : ""
              }`}
              onClick={() => {
                handleReconnect();
              }}
            />
            <Dropdown
              options={tableNames}
              onSelect={handleTableSelect}
              activeTable={activeTable}
            />
          </div>
          {activeDatabase?.type && (
            <span className={styles.databaseType}>
              {activeDatabase?.type} | {activeDatabase?.params?.database}
            </span>
          )}
        </div>
        <div className={styles.buttons}>
          <TableButtons
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            cellSize={cellSize}
            setCellSize={setCellSize}
            showCellBorders={showCellBorders}
            setShowCellBorders={setShowCellBorders}
            textAlignment={textAlignment}
            setTextAlignment={setTextAlignment}
          />
        </div>
      </div>
      <div className={styles.table}>
        <DynamicTable
          data={tableValues}
          columns={columns}
          maxDisplay={rowsPerPage}
          cellSize={cellSize as any}
          showCellBorders={showCellBorders}
          textAlignment={textAlignment as any}
        />
      </div>
    </section>
  );
}

function TableButtons({
  rowsPerPage,
  setRowsPerPage,
  cellSize,
  setCellSize,
  showCellBorders,
  setShowCellBorders,
  textAlignment,
  setTextAlignment,
}: any) {
  const [showSettings, setShowSettings] = useState(false);

  const dispatch = useDispatch();

  function handleSQL() {
    dispatch(toggleSQLEditor());
  }

  function handleExport() {}

  function handleSettings() {
    setShowSettings(!showSettings);
  }

  return (
    <div className={styles.tableButtons}>
      <button
        className={`${styles.button} ${styles.buttonStyle1}`}
        onClick={handleSQL}
      >
        SQL
      </button>
      <button
        className={`${styles.button} ${styles.buttonStyle2}`}
        onClick={handleExport}
      >
        Export
      </button>
      <button
        className={`${styles.button} ${styles.buttonStyle3}`}
        onClick={handleSettings}
      >
        <IoMdSettings size={30} />
      </button>

      <div className={`${styles.settings} ${showSettings ? styles.show : ""}`}>
        <div className={styles.settingsRow}>
          <label htmlFor="rowsPerPage" className={styles.settingsLabel}>
            Rows per page
          </label>
          <select
            name="rowsPerPage"
            className={styles.settingsOption}
            onChange={(e) => setRowsPerPage(e.target.value)}
            defaultValue={rowsPerPage}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.settingsRow}>
          <label htmlFor="cellSize" className={styles.settingsLabel}>
            Cell Size
          </label>
          <select
            name="cellSize"
            className={styles.settingsOption}
            onChange={(e) => setCellSize(e.target.value)}
            defaultValue={cellSize}
          >
            <option value={"small"}>Small</option>
            <option value={"medium"}>Medium</option>
            <option value={"large"}>Large</option>
          </select>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.settingsRow}>
          <label htmlFor="showCellBorders" className={styles.settingsLabel}>
            Show Cell Border
          </label>
          <input
            type="checkbox"
            name="showCellBorders"
            className={styles.settingsOption}
            onChange={(e) => setShowCellBorders(e.target.checked)}
            defaultChecked={showCellBorders}
          />
        </div>
        <div className={styles.separator}></div>
        <div className={styles.settingsRow}>
          <label htmlFor="textAlignment" className={styles.settingsLabel}>
            Alignment
          </label>
          <select
            name="textAlignment"
            className={styles.settingsOption}
            onChange={(e) => setTextAlignment(e.target.value)}
            defaultValue={textAlignment}
          >
            <option value={"left"}>Left</option>
            <option value={"center"}>Center</option>
            <option value={"right"}>Right</option>
          </select>
        </div>
      </div>
    </div>
  );
}
