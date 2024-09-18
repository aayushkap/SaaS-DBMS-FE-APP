import React, { useState } from "react";

import ToolTip from "@/app/components/ToolTip/ToolTip";
import truncate from "@/app/helper/helpers";

import { setConnections, addConnection } from "@/store/slices/connectionsSlice";
import { clearActiveDatabase } from "@/store/slices/tableSlice";
import { SiManageiq } from "react-icons/si";

import {
  BsDatabaseFillCheck,
  BsDatabaseFillExclamation,
  BsChevronDown,
  BsChevronRight,
  BsFillArrowUpRightCircleFill,
} from "react-icons/bs";
import { PiTableDuotone } from "react-icons/pi";
import { MdDeleteForever } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import styles from "./ManageConnectionsComp.module.scss";

function ConnectionListItem({
  response,
  databaseInfo,
  setDatabaseInfo,
}: {
  response: any;
  databaseInfo: any;
  setDatabaseInfo: any;
}) {
  const { DATABASE_INFO, CONNECTION_SUCCESS } = response;

  const handleDatabaseInfo = () => {
    if (databaseInfo) {
      setDatabaseInfo(null);
    } else {
      setDatabaseInfo(response);
    }
  };

  const dispatch = useDispatch();

  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

  const handleDatabaseDelete = () => {
    setDatabaseInfo(null);
    dispatch(clearActiveDatabase());
    dispatch(setConnections(connections.filter((item) => item !== response)));
  };

  return (
    <div className={styles.connectionListItem}>
      <div className={styles.connectionDatabase}>
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
          {truncate(DATABASE_INFO?.params?.database ?? "", 20)}
        </div>
        <div className={styles.connectionIcons}>
          <ToolTip message="Delete Connection">
            <MdDeleteForever size={25} onClick={() => handleDatabaseDelete()} />
          </ToolTip>
          <ToolTip message="Show Connection Info">
            <SiManageiq size={22} onClick={() => handleDatabaseInfo()} />
          </ToolTip>
        </div>
      </div>
    </div>
  );
}

export default function ManageConnectionsComp() {
  const [databaseInfo, setDatabaseInfo] = useState<any>(null);
  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

  return (
    <div
      className={`${styles.container} ${databaseInfo ? styles.expanded : ""}`}
    >
      {connections.length > 0 ? (
        connections.map((response, index) => (
          <ConnectionListItem
            key={index}
            response={response}
            databaseInfo={databaseInfo}
            setDatabaseInfo={setDatabaseInfo}
          />
        ))
      ) : (
        <p>No Connections.</p>
      )}
      {databaseInfo && <div className={styles.verticalDivider} />}
      {databaseInfo && (
        <>
          <div className={styles.showConnection}>
            {Object.entries(databaseInfo.DATABASE_INFO.params).map(
              ([key, value]) => (
                <ToolTip message={`${key} : ${value}`} key={key}>
                  <div className={styles.showConnectionItem}>
                    <span>{key.toUpperCase()}</span>:{" "}
                    {truncate(String(value ?? "N/A"), 30)}
                  </div>
                </ToolTip>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
