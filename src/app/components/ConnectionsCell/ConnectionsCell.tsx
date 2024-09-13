import React, { useState } from "react";
import styles from "./ConnectionsCell.module.scss";

import ConnectionsList from "../ConnectionsList/ConnectionsList";
import ToolTip from "@/app/components/ToolTip/ToolTip";

import { IoIosSearch } from "react-icons/io";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { BsDatabaseFillGear } from "react-icons/bs";
import ConnectionControl from "../ConnectionControl/ConnectionControl";

export default function ConnectionsCell() {
  const [connectionsFilter, setConnectionsFilter] = useState<string>("");

  return (
    <section className={styles.container}>
      <h2 className={styles.cellTitle}>Connections</h2>
      <div className={styles.connectionButtons}>
        <ConnectionControl />
      </div>
      <div className={styles.connectionSearch}>
        <IoIosSearch className={styles.searchIcon} size={25} />
        <input
          className={styles.searchBar}
          placeholder="Search Connections"
          onChange={(e) => setConnectionsFilter(e.target.value)}
        />
      </div>
      <div className={styles.connectionList}>
        <ConnectionsList filter={connectionsFilter} />
      </div>
    </section>
  );
}
