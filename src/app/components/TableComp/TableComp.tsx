import React, { useState, useEffect } from "react";
import {
  FaSort,
  FaHashtag,
  FaFont,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa"; // Import the missing icons
import { TbAbc } from "react-icons/tb";
import styles from "./TableComp.module.scss";
import Tooltip from "../ToolTip/ToolTip";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

// Define types for the component props
type Column = {
  Field: string;
  Type: string;
};

type Data = {
  [key: string]: string | number; // Define the shape of data to be string or number
};

type DynamicTableProps = {
  data: Data[];
  columns: Column[];
  maxDisplay?: number;
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  data,
  columns,
  maxDisplay = 2,
}) => {
  const [sortConfigs, setSortConfigs] = useState<
    { key: string; direction: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  useEffect(() => {
    setIsFiltered(sortConfigs.length > 0);
  }, [sortConfigs]);

  const getIconForType = (type: string) => {
    type = type.toLowerCase();
    if (type.includes("int")) {
      return <FaHashtag size={15} />;
    } else if (type.includes("varchar")) {
      return <TbAbc size={20} />;
    }
    return null;
  };

  const handleSort = (key: string) => {
    const existingConfig = sortConfigs.find((config) => config.key === key);
    let newDirection = "asc";
    if (existingConfig) {
      if (existingConfig.direction === "asc") {
        newDirection = "desc";
      } else if (existingConfig.direction === "desc") {
        newDirection = "";
      }
    }

    const updatedSortConfigs = sortConfigs.filter(
      (config) => config.key !== key
    );
    if (newDirection) {
      updatedSortConfigs.push({ key, direction: newDirection });
    }

    setSortConfigs(updatedSortConfigs);
  };

  const handleResetFilters = () => {
    setSortConfigs([]);
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    for (let config of sortConfigs) {
      const aValue = a[config.key];
      const bValue = b[config.key];
      if (aValue < bValue) {
        return config.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return config.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / maxDisplay);
  const currentData = sortedData.slice(
    (currentPage - 1) * maxDisplay,
    currentPage * maxDisplay
  );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.filterControls}>
        <button
          className={`${styles.resetButton} ${
            isFiltered ? styles.highlighted : ""
          }`}
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => {
              const columnInfo = columns.find((col) => col.Field === key);
              const icon = columnInfo ? getIconForType(columnInfo.Type) : null;
              const sortConfig = sortConfigs.find(
                (config) => config.key === key
              );
              const isSorted = sortConfig ? sortConfig.direction : null;

              return (
                <th key={key}>
                  <div className={styles.columnInfo}>
                    {icon} {key}
                    {isSorted === "asc" ? (
                      <FaSortUp
                        onClick={() => handleSort(key)}
                        className={`${styles.sortIcon} ${
                          isSorted ? styles.active : ""
                        }`}
                      />
                    ) : isSorted === "desc" ? (
                      <FaSortDown
                        onClick={() => handleSort(key)}
                        className={`${styles.sortIcon} ${
                          isSorted ? styles.active : ""
                        }`}
                      />
                    ) : (
                      <FaSort
                        onClick={() => handleSort(key)}
                        className={`${styles.sortIcon} ${
                          isSorted ? styles.active : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          className={`${styles.pageButton} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
          onClick={() => setCurrentPage(1)}
        >
          First
        </button>
        <span className={styles.centralControls}>
          <button
            disabled={currentPage === 1}
            className={`${styles.pageButton} ${
              currentPage === 1 ? styles.disabled : ""
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <IoIosArrowBack />
          </button>
          Page {currentPage} of {totalPages}
          <button
            disabled={currentPage === totalPages}
            className={`${styles.pageButton} ${
              currentPage === totalPages ? styles.disabled : ""
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <IoIosArrowForward />
          </button>
        </span>

        <button
          disabled={currentPage === totalPages}
          className={`${styles.pageButton} ${
            currentPage === totalPages ? styles.disabled : ""
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;
