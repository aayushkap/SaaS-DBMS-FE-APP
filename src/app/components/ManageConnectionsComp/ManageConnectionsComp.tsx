import React, { useState } from "react";

import ToolTip from "@/app/components/ToolTip/ToolTip";
import truncate from "@/app/helper/helpers";

import { setConnections, addConnection } from "@/store/slices/connectionsSlice";
import { clearActiveDatabase } from "@/store/slices/tableSlice";
import { SiManageiq, SiTicktick } from "react-icons/si";

import {
  BsDatabaseFillCheck,
  BsDatabaseFillExclamation,
  BsChevronDown,
  BsChevronRight,
  BsFillArrowUpRightCircleFill,
} from "react-icons/bs";
import { PiTableDuotone } from "react-icons/pi";
import { MdDeleteForever, MdSmsFailed } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import styles from "./ManageConnectionsComp.module.scss";
import { FiRefreshCcw } from "react-icons/fi";
import { useTestConnectionMutation } from "@/app/helper/genericMutations";

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
    if (response) {
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

  const {
    mutate: testConnection,
    isPending: isTestConnectionPending,
    isError,
    isSuccess,
    error,
    data,
  } = useTestConnectionMutation();

  const handleReconnect = () => {
    const credentials = {
      database_type: response?.DATABASE_INFO?.type,
      params: response?.DATABASE_INFO?.params,
    };

    testConnection(credentials, {
      onSuccess: (data) => {},
      onError: (error) => {},
    });
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
          <ToolTip message="Show Connection Info">
            <SiManageiq size={22} onClick={() => handleDatabaseInfo()} />
          </ToolTip>
          <ToolTip message="Delete Connection">
            <MdDeleteForever size={25} onClick={() => handleDatabaseDelete()} />
          </ToolTip>
          <ToolTip message="Test Connection">
            <FiRefreshCcw
              className={`${styles.icon} ${
                isTestConnectionPending ? styles.active : ""
              }`}
              size={18}
              onClick={() => {
                handleReconnect();
              }}
            />
          </ToolTip>
          {isError && (
            <ToolTip message={error?.message}>
              <MdSmsFailed size={20} color="red" />
            </ToolTip>
          )}
          {isSuccess && (
            <ToolTip message="Connection Successful">
              <SiTicktick size={20} color="green" />
            </ToolTip>
          )}
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
      <div className={styles.connectionList}>
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
        )}{" "}
      </div>
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
