import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaSort,
  FaHashtag,
  FaSortUp,
  FaSortDown,
  FaCalendar,
  FaOrcid,
} from "react-icons/fa";
import { TbDecimal, TbJson } from "react-icons/tb";
import { BsColumns } from "react-icons/bs";
import { TbAbc } from "react-icons/tb";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import styles from "./TableComp.module.scss";
import Tooltip from "../ToolTip/ToolTip";
import truncate from "@/app/helper/helpers";

type Column = {
  Field: string;
  Type: string;
};

type Data = {
  [key: string]: string | number;
};

type DynamicTableProps = {
  data: Data[];
  columns: Column[];
  cellSize?: "small" | "medium" | "large";
  showCellBorders?: boolean;
  textAlignment?: "left" | "center" | "right";
  maxDisplay?: number;
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  data,
  columns,
  cellSize = "medium",
  showCellBorders = true,
  textAlignment = "center",
  maxDisplay = 3,
}) => {
  const [sortConfigs, setSortConfigs] = useState<
    { key: string; direction: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isFiltered = useMemo(() => sortConfigs.length > 0, [sortConfigs]);

  const getIconForType = useCallback((type: string) => {
    const lowerType = type?.toLowerCase() ?? "";
    if (lowerType.includes("int")) return <FaHashtag size={15} />;
    if (lowerType.includes("char") || lowerType.includes("text"))
      return <TbAbc size={20} />;
    if (lowerType.includes("date") || lowerType.includes("time"))
      return <FaCalendar size={15} />;
    if (
      lowerType.includes("double") ||
      lowerType.includes("float" || lowerType.includes("decimal"))
    )
      return <TbDecimal size={20} />;
    if (lowerType.includes("id")) return <FaOrcid size={15} />;
    if (lowerType.includes("json")) return <TbJson size={15} />;
    return <BsColumns size={18} />;
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfigs((prevConfigs) => {
      const existingConfig = prevConfigs.find((config) => config.key === key);
      let newDirection = "asc";

      if (existingConfig) {
        newDirection = existingConfig.direction === "asc" ? "desc" : "";
      }

      const updatedConfigs = prevConfigs.filter((config) => config.key !== key);
      if (newDirection) {
        updatedConfigs.push({ key, direction: newDirection });
      }

      return updatedConfigs;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSortConfigs([]);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    handleResetFilters();
  }, [maxDisplay, data]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      for (let config of sortConfigs) {
        const aValue = a[config.key];
        const bValue = b[config.key];
        if (aValue < bValue) return config.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return config.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfigs]);

  const totalPages = useMemo(
    () => Math.ceil(sortedData.length / maxDisplay),
    [sortedData, maxDisplay]
  );
  const currentData = useMemo(
    () =>
      sortedData.slice(
        (currentPage - 1) * maxDisplay,
        currentPage * maxDisplay
      ),
    [sortedData, currentPage, maxDisplay]
  );

  if (!data.length) return <div></div>;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.filterControls}>
        <button
          className={`${styles.resetButton} ${
            isFiltered ? styles.highlighted : styles.disabled
          }`}
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>

      <table className={showCellBorders ? styles.bordered : styles.noBorder}>
        <thead>
          <tr>
            {columns.map(({ Field, Type }) => {
              const sortConfig = sortConfigs.find(
                (config) => config.key === Field
              );
              const isSorted = sortConfig ? sortConfig.direction : null;

              return (
                <th
                  key={Field}
                  className={`${styles.cell} ${styles[cellSize]} ${styles[textAlignment]}`}
                  onClick={() => handleSort(Field)}
                >
                  <div className={styles.columnInfo}>
                    {getIconForType(Type)} {Field}
                    {isSorted === "asc" && (
                      <FaSortUp
                        className={`${styles.sortIcon} ${styles.active}`}
                      />
                    )}
                    {isSorted === "desc" && (
                      <FaSortDown
                        className={`${styles.sortIcon} ${styles.active}`}
                      />
                    )}
                    {!isSorted && <FaSort className={styles.sortIcon} />}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr key={index}>
              {columns.map(({ Field }) => (
                <td
                  key={Field}
                  className={`${styles.cell} ${styles[cellSize]} ${styles[textAlignment]}`}
                >
                  <Tooltip message={`${Field}: ${row[Field]?.toString()}`}>
                    {truncate(row[Field]?.toString() ?? "", 15)}
                  </Tooltip>
                </td>
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <IoIosArrowBack />
          </button>
          Page {currentPage} of {totalPages}
          <button
            disabled={currentPage === totalPages}
            className={`${styles.pageButton} ${
              currentPage === totalPages ? styles.disabled : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
