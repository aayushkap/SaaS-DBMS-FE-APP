// components/Dropdown.tsx
import React from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [selected, setSelected] = React.useState<string>(options[0]);

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
            {option}
          </option>
        ))
      ) : (
        <option value="" className={styles.option}>
          Add A Connection
        </option>
      )}
    </select>
  );
};

export default Dropdown;
