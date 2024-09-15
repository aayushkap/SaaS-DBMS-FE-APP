import React, { useState } from "react";
import styles from "./AddConnectionComp.module.scss";

import { SiMysql } from "react-icons/si";
import { SiPostgresql } from "react-icons/si";
import { SiMicrosoftsqlserver } from "react-icons/si";

import Tooltip from "../ToolTip/ToolTip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { addConnection } from "@/store/slices/connectionsSlice";

import { useQuery } from "@tanstack/react-query";
import { testConnection } from "@/app/api/query";
import { useMutation } from "@tanstack/react-query"; // For react-query v4

// Sample JSON configuration
type DBConfig = {
  [key: string]: {
    params: {
      title: string;
      type: "input" | "checkbox";
      inputType?: "text" | "number" | "password";
      key: string;
      required?: boolean;
    }[];
  };
};

const dbConfig: DBConfig = {
  mysql: {
    params: [
      {
        title: "Host",
        type: "input",
        inputType: "text",
        key: "host",
        required: true,
      },
      {
        title: "Port",
        type: "input",
        inputType: "number",
        key: "port",
        required: true,
      },
      {
        title: " User",
        type: "input",
        inputType: "text",
        key: "user",
        required: true,
      },
      {
        title: "Password",
        type: "input",
        inputType: "password",
        key: "password",
        required: true,
      },
      { title: "Use SSL", type: "checkbox", key: "useSSL" },
    ],
  },
  postgres: {
    params: [
      {
        title: "Host",
        type: "input",
        inputType: "text",
        key: "host",
        required: true,
      },
      {
        title: "Port",
        type: "input",
        inputType: "number",
        key: "port",
        required: true,
      },
      {
        title: " User",
        type: "input",
        inputType: "text",
        key: "user",
        required: true,
      },
      {
        title: "Password",
        type: "input",
        inputType: "password",
        key: "password",
        required: true,
      },
      {
        title: "Database",
        type: "input",
        inputType: "text",
        key: "database",
        required: true,
      },
      {
        title: "Require SSL",
        type: "checkbox",
        key: "requireSSL",
      },
    ],
  },
  mssql: {
    params: [
      {
        title: "Host",
        type: "input",
        inputType: "text",
        key: "host",
        required: true,
      },
      {
        title: "Port",
        type: "input",
        inputType: "number",
        key: "port",
        required: true,
      },
      {
        title: "User",
        type: "input",
        inputType: "text",
        key: "user",
        required: true,
      },
      {
        title: "Password",
        type: "input",
        inputType: "password",
        key: "password",
      },
      {
        title: "Integrated Security",
        type: "checkbox",
        key: "integratedSecurity",
      },
    ],
  },
};

interface CustomFormData {
  [key: string]: string | number | boolean | undefined;
}

export default function ConnectionControl() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDB, setSelectedDB] = useState<string>("");
  const [formData, setFormData] = useState<CustomFormData>({});

  const testConnectionMutation = useMutation({
    mutationFn: (credentials: any) => testConnection(credentials),
    onSuccess: (data) => {
      if (data?.SUCCESS) {
        setError("");

        const connectionResponse = data.DATABASE_INFO;

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

  const handleDBSelect = (dbType: string) => {
    setSelectedDB(dbType);

    setFormData({ type: dbType });
    setCurrentPage(2);
  };

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(3);

    // Dynamically build the params object by looping over formData
    const params = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== undefined) acc[key] = formData[key];
      return acc;
    }, {} as { [key: string]: string | number | boolean });

    const credentials = {
      database_type: selectedDB.toString(),
      params: params, // Assign the dynamically built params
    };

    testConnectionMutation.mutate(credentials);
  };

  return (
    <div className={styles.formContainer}>
      {currentPage === 1 && (
        <>
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
        </>
      )}
      {currentPage === 2 && (
        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>{selectedDB.toUpperCase()}</h3>
          <form onSubmit={handleSubmit}>
            {dbConfig[selectedDB]?.params.map((param) => (
              <>
                {param.type === "input" ? (
                  <div className={styles.formField} key={param.key}>
                    <label>{param.title}</label>
                    <input
                      type={param.inputType}
                      className={styles.input}
                      {...(param.required && { required: true })}
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
                  </div>
                ) : (
                  <div className={styles.formCheck} key={param.key}>
                    <label>{param.title}</label>
                    <input
                      type="checkbox"
                      checked={!!formData[param.key] as boolean}
                      {...(param.required && { required: true })}
                      className={styles.checkbox}
                      onChange={(e) =>
                        handleInputChange(param.key, e.target.checked)
                      }
                    />
                  </div>
                )}
              </>
            ))}
            <div className={styles.formActions}>
              <button type="button" onClick={() => setCurrentPage(1)}>
                Back
              </button>
              <button type="submit">Connect</button>
            </div>
          </form>
        </div>
      )}
      {currentPage === 3 && <div>{error}</div>}
    </div>
  );
}
