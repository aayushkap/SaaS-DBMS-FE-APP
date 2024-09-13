import React, { useState } from "react";
import styles from "./TableCell.module.scss";

import { FiRefreshCcw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import Dropdown from "../Dropdown/Dropdown";

import { setActiveTable } from "@/store/slices/tableSlice";
import { table } from "console";
import DynamicTable from "../TableComp/TableComp";

export default function TableCell() {
  const dispatch = useDispatch();

  // Selectors for getting state values
  const activeTable = useSelector(
    (state: RootState) => state.table.activeTable
  );

  const activeDatabase = useSelector(
    (state: RootState) => state.table.activeDatabase
  );

  // Safely get table names from activeDatabase's tables
  const tableNames = Object.keys(activeDatabase?.tables ?? {});

  // Check if activeTable is not null before accessing tableValues
  const tableValues = activeTable
    ? activeDatabase?.tables?.[activeTable]?.sample_data ?? []
    : [];

  const columns = activeTable
    ? activeDatabase?.tables?.[activeTable]?.column_info
    : [];

  console.log("Table Values: ", tableValues);
  console.log("Columns: ", columns);

  // Function to handle table selection
  function handleTableSelect(tableName: string) {
    console.log("Selected Table: ", tableName);
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
          <div className={styles.tableDescription}>
            {activeTable
              ? `Selected Table: ${activeTable}`
              : "No table selected"}
          </div>
        </div>
        <div className={styles.view}>Views</div>
        <div className={styles.buttons}>Buttons</div>
      </div>
      <div className={styles.table}>
        {/* You can display more details about the selected table here */}
        {activeTable && <p>Showing details for: {activeTable}</p>}
        <DynamicTable data={tableValues} columns={columns} />
      </div>
    </section>
  );
}
