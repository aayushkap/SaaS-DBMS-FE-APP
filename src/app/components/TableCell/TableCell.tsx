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
          <TableButtons />
        </div>
      </div>
      <div className={styles.table}>
        <DynamicTable data={tableValues} columns={columns} />
      </div>
    </section>
  );
}

function TableButtons() {
  const dispatch = useDispatch();
  function handleSQL() {
    dispatch(toggleSQLEditor());
  }
  function handleExport() {}
  function handleSettings() {}
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
    </div>
  );
}
