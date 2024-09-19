import React, { useState } from "react";
import styles from "./AddConnectionComp.module.scss";

import { SiMysql, SiPostgresql, SiMicrosoftsqlserver } from "react-icons/si";

import Tooltip from "../ToolTip/ToolTip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { addConnection } from "@/store/slices/connectionsSlice";

import { useMutation } from "@tanstack/react-query";
import { testConnection } from "@/app/api/query";
import dbConfig from "@/app/helper/store";
import truncate from "@/app/helper/helpers";

import { Loader } from "../Loader1/Loader";
import { useTestConnectionMutation } from "@/app/helper/genericMutations";

interface CustomFormData {
  [key: string]: string | number | boolean | undefined;
}

export default function ConnectionControl() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDB, setSelectedDB] = useState<string>("");
  const [formData, setFormData] = useState<CustomFormData>({});

  const connections = useSelector(
    (state: RootState) => state.connections.connections
  );

  // const testConnectionMutation = useMutation({
  //   mutationFn: testConnection,
  //   onSuccess: (data) => {
  //     if (data?.SUCCESS) {
  //       setMessage("Successfully connected to database");
  //       const isDuplicate = connections.some(
  //         (connection) =>
  //           connection.CONNECTION_SUCCESS === data.CONNECTION_SUCCESS &&
  //           connection.DATABASE_INFO.name === data.DATABASE_INFO.name &&
  //           connection.DATABASE_INFO.type === data.DATABASE_INFO.type
  //       );

  //       if (isDuplicate) {
  //         setMessage("A similar connection already exists.");
  //       } else {
  //         dispatch(addConnection(data));
  //       }
  //     } else {
  //       setMessage("Query Failed");
  //     }
  //   },
  //   onError: (e) =>
  //     setMessage(`Error connecting to database: ${truncate(e.toString(), 50)}`),
  // });

  const handleDBSelect = (dbType: string) => {
    setSelectedDB(dbType);
    setFormData((prevFormData) => ({ ...prevFormData, type: dbType }));
    setCurrentPage(2);
  };

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setFormData((prevFormData) => ({ ...prevFormData, [key]: value }));
  };

  const {
    mutate: testConnection,
    isPending: isTestConnectionPending,
    isError,
    isSuccess,
    error,
    data,
  } = useTestConnectionMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const credentials = {
      database_type: selectedDB,
      params: formData,
    };

    setCurrentPage(3);

    testConnection(credentials, {
      onSuccess: (data) => {
        console.log("Added Connection Success", data);
        setMessage("Successfully connected to database!");
      },
      onError: (error) => {
        console.log("Failed To Add Connection", error);
        setMessage(
          `Error connecting to database: ${truncate(error.toString(), 50)}`
        );
      },
    });
  };

  const renderFormFields = () =>
    dbConfig[selectedDB]?.params.map((param) => (
      <div className={styles.formField} key={param.key}>
        <label>{param.title}</label>
        {param.type === "input" ? (
          <input
            type={param.inputType}
            className={styles.input}
            required={!!param.required}
            value={
              param.inputType === "number"
                ? (formData[param.key] as number) || ""
                : (formData[param.key] as string) || ""
            }
            onChange={(e) =>
              handleInputChange(
                param.key,
                param.inputType === "number"
                  ? Number(e.target.value)
                  : e.target.value
              )
            }
          />
        ) : (
          <input
            type="checkbox"
            checked={!!formData[param.key]}
            className={styles.checkbox}
            onChange={(e) => handleInputChange(param.key, e.target.checked)}
          />
        )}
      </div>
    ));

  return (
    <div className={styles.container}>
      {currentPage === 1 && (
        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>Database Type</h3>
          <div className={styles.dbSelect}>
            <button
              className={styles.dbButton}
              onClick={() => handleDBSelect("mysql")}
            >
              <SiMysql className={styles.dbIcon} />
            </button>
            <button
              className={styles.dbButton}
              onClick={() => handleDBSelect("postgres")}
            >
              <SiPostgresql className={styles.dbIcon} />
            </button>
            <button
              className={styles.dbButton}
              onClick={() => handleDBSelect("mssql")}
            >
              <SiMicrosoftsqlserver className={styles.dbIcon} />
            </button>
          </div>
        </div>
      )}
      {currentPage === 2 && (
        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>{selectedDB.toUpperCase()}</h3>
          <form onSubmit={handleSubmit}>
            {renderFormFields()}
            <div className={styles.formActions}>
              <button type="button" onClick={() => setCurrentPage(1)}>
                Back
              </button>
              <button type="submit">Connect</button>
            </div>
          </form>
        </div>
      )}
      {currentPage === 3 &&
        (isTestConnectionPending ? (
          <div>
            <Loader />
          </div>
        ) : (
          <div className={styles.message}>
            {message}
            <button
              className={styles.dbButton}
              onClick={() => setCurrentPage(2)}
            >
              Go Back
            </button>
          </div>
        ))}
    </div>
  );
}
