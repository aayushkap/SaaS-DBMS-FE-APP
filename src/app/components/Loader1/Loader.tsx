import React from "react";
import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.container} style={{ width: "100%", height: "100%" }}>
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
    </div>
  );
};
