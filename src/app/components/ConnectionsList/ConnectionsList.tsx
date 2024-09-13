import React, { useState, useEffect } from "react";
import styles from "./ConnectionsList.module.scss";

import ToolTip from "@/app/components/ToolTip/ToolTip";

import truncate from "@/app/helper/helpers";

import { setConnections, addConnection } from "@/store/slices/connectionsSlice";

import { setActiveTable, setActiveDatabase } from "@/store/slices/tableSlice";

import {
  BsDatabaseFillCheck,
  BsDatabaseFillExclamation,
  BsChevronDown,
  BsChevronRight,
  BsFillArrowUpRightCircleFill,
} from "react-icons/bs";

import { PiTableDuotone } from "react-icons/pi";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";

function ConnectionListItem({
  response,
  filter,
}: {
  response: any;
  filter: string;
}) {
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  const toggleDatabase = () => {
    setIsDatabaseOpen(!isDatabaseOpen);
  };

  return (
    <>
      {(!filter ||
        response?.DATABASE_INFO?.name
          .toLowerCase()
          .includes(filter.toLowerCase())) && (
        <div className={styles.connectionListItem}>
          <div className={styles.connectionDatabase} onClick={toggleDatabase}>
            <div className={styles.connectionName}>
              {response.CONNECTION_SUCCESS ? (
                <BsDatabaseFillCheck
                  className={styles.connectionIcon}
                  size={20}
                  color="green"
                />
              ) : (
                <BsDatabaseFillExclamation
                  className={styles.connectionIcon}
                  size={20}
                  color="red"
                />
              )}
              {truncate(response?.DATABASE_INFO?.name ?? "", 15)}
            </div>
            <div>
              {" "}
              {isDatabaseOpen ? <BsChevronDown /> : <BsChevronRight />}
            </div>
          </div>
          <div className={styles.connectionInfo}>
            {isDatabaseOpen && response.CONNECTION_SUCCESS && (
              <ConnectionItemTables
                tables={response.DATABASE_INFO.tables}
                databaseInfo={response.DATABASE_INFO}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ConnectionItemTables({
  tables,
  databaseInfo,
}: {
  tables: any;
  databaseInfo: any;
}) {
  // console.log("Tables: ", tables);
  const dispatch = useDispatch();

  function changeActiveTable(tableName: string, tableData: any) {
    console.log("Changing active database: ", databaseInfo);
    console.log("Changing active table: ", tableName);
    ``;
    dispatch(setActiveTable(tableName));
    dispatch(setActiveDatabase(databaseInfo));
  }

  return (
    <div className={styles.connectionTables}>
      {Object.keys(tables).map((table) => {
        return (
          <div key={table} className={styles.table}>
            <div
              className={styles.tableHeader}
              onClick={() => changeActiveTable(table, tables[table])}
            >
              <h3 className={styles.tableName}>
                <PiTableDuotone size={20} />
                {truncate(table ?? "", 10)}
              </h3>

              <BsFillArrowUpRightCircleFill size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ConnectionsList({ filter }: { filter: string }) {
  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

  // console.log("In ConnectionsList: ", connections);

  return (
    <div>
      <div className={styles.divider} />
      {connections.length > 0 ? (
        connections.map((response, index) => (
          <ConnectionListItem key={index} response={response} filter={filter} />
        ))
      ) : (
        <p>No connections available.</p>
      )}
    </div>
  );
}
