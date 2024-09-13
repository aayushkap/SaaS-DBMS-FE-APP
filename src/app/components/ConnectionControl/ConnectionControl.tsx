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
          onClick={handleOpenDialog(<AddConnection />)}
        >
          <BsDatabaseFillAdd className={styles.connectionIcon} size={25} />
        </button>
      </ToolTip>
      <ToolTip message="Manage Connections">
        <button
          className={styles.connectionButton}
          onClick={handleOpenDialog(<ManageConnections />)}
        >
          <BsDatabaseFillGear className={styles.connectionIcon} size={25} />
        </button>
      </ToolTip>
    </div>
  );
}

function AddConnection() {
  const [host, setHost] = useState("autorack.proxy.rlwy.net");
  const [dbUser, setDbUser] = useState("root");
  const [database, setDatabase] = useState("student_db");
  const [password, setPassword] = useState("FNuibirNYzdOYYmyTbarZaemmNgPaLUs");
  const [port, setPort] = useState(33695);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const testConnectionMutation = useMutation({
    mutationFn: (credentials: any) => testConnection(credentials),
    onSuccess: (data) => {
      if (data?.SUCCESS) {
        setError("");
        // console.log("Connection successful: " + data);
        const connectionResponse = data.DATABASE_INFO;
        // console.log(connectionResponse);

        // Add connection to redux store
        dispatch(addConnection(data));

        // Save connection to redux store
      } else {
        setError("Query Failed");
      }
    },
    onError: () => {
      setError("Query Failed");
    },
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    // console.log("Adding Connection");

    const credentials = {
      database_type: "mysql",
      params: {
        host: host,
        user: dbUser,
        password: password,
        database: database,
        port: port,
      },
    };

    testConnectionMutation.mutate(credentials);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        type:mysql
        <div>
          <label htmlFor="host">Host</label>
          <input
            id="host"
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="dbUser">DB User</label>
          <input
            id="dbUser"
            type="text"
            value={dbUser}
            onChange={(e) => setDbUser(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="port">Port</label>
          <input
            id="port"
            type="number"
            value={port}
            onChange={(e) => setPort(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="database">DATABASE</label>
          <input
            id="database"
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
          />
        </div>
        <button type="submit">Add Connection</button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
}

function ManageConnections() {
  return <div>Manage Connections</div>;
}
