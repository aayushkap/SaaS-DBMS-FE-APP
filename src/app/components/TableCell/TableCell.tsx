import React, { useState } from "react";
import styles from "./TableCell.module.scss";

import { FiRefreshCcw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import Dropdown from "../Dropdown/Dropdown";

import { setActiveTable } from "@/store/slices/tableSlice";
import DynamicTable from "../TableComp/TableComp";
import { IoMdSettings } from "react-icons/io";
import { toggleSQLEditor } from "@/store/slices/settingsSlice";

export default function TableCell() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cellSize, setCellSize] = useState("medium");
  const [showCellBorders, setShowCellBorders] = useState(true);
  const [textAlignment, setTextAlignment] = useState("center");

  const dispatch = useDispatch();

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

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tableInfo}>
          <div className={styles.tableName}>
            <FiRefreshCcw className={styles.icon} />
            <Dropdown options={tableNames} onSelect={handleTableSelect} />
          </div>
        </div>
        <div className={styles.view}>Views</div>
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
