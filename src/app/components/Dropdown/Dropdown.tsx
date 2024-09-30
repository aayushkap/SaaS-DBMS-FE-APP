import React, { useEffect } from "react";
import styles from "./Dropdown.module.scss";
import truncate from "@/app/helper/helpers";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  activeTable: string | null;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  activeTable,
}) => {
  const [selected, setSelected] = React.useState<string>(options[0]);

  useEffect(() => {
    if (activeTable && options.includes(activeTable)) {
      setSelected(activeTable); // Set without truncation
    } else {
      setSelected(options[0]); // Default to first option if no active table
    }
  }, [activeTable, options]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className={styles.dropdown}
    >
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option} value={option} className={styles.option}>
            {option === selected ? truncate(option, 20) : truncate(option, 30)}
          </option>
        ))
      ) : (
        <option value="" className={styles.option}>
          No Selection
        </option>
      )}
    </select>
  );
};

export default Dropdown;
