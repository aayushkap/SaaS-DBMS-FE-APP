import React, { useState } from "react";
import styles from "./ConnectionsList.module.scss";

import ToolTip from "@/app/components/ToolTip/ToolTip";
import truncate from "@/app/helper/helpers";

import { setConnections, addConnection } from "@/store/slices/connectionsSlice";
import {
  setActiveTable,
  setActiveDatabase,
  setShowQueries,
} from "@/store/slices/tableSlice";

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
  const { DATABASE_INFO, CONNECTION_SUCCESS } = response;

  const toggleDatabase = () => setIsDatabaseOpen((prev) => !prev);

  const isFiltered =
    !filter ||
    DATABASE_INFO?.name?.toLowerCase().includes(filter.toLowerCase());

  if (!isFiltered) return null;

  return (
    <div className={styles.connectionListItem}>
      <div className={styles.connectionDatabase} onClick={toggleDatabase}>
        <div className={styles.connectionName}>
          {CONNECTION_SUCCESS ? (
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
          {truncate(DATABASE_INFO?.params?.database ?? "", 15)}
        </div>
        <div>{isDatabaseOpen ? <BsChevronDown /> : <BsChevronRight />}</div>
      </div>
      {isDatabaseOpen && CONNECTION_SUCCESS && (
        <div className={styles.connectionInfo}>
          <ConnectionItemTables
            tables={DATABASE_INFO.tables}
            databaseInfo={DATABASE_INFO}
          />
        </div>
      )}
    </div>
  );
}

function ConnectionItemTables({
  tables,
  databaseInfo,
}: {
  tables: any;
  databaseInfo: any;
}) {
  const dispatch = useDispatch();

  const changeActiveTable = (tableName: string, tableData: any) => {
    dispatch(setActiveTable(tableName));
    dispatch(setActiveDatabase(databaseInfo));
    dispatch(setShowQueries(false));
  };

  return (
    <div className={styles.connectionTables}>
      {Object.keys(tables).map((table) => (
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
      ))}
    </div>
  );
}

export default function ConnectionsList({ filter }: { filter: string }) {
  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

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
