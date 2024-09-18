// components/Dropdown.tsx
import React, { useEffect } from "react";
import styles from "./Dropdown.module.scss";

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
    if (activeTable) {
      setSelected(activeTable);
    }
  }, [activeTable]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      defaultValue={options[0]}
      className={styles.dropdown}
    >
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option} value={option} className={styles.option}>
            {option}
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
