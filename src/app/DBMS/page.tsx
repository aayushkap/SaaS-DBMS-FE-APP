"use client";

import React, { useEffect } from "react";
import { useState, useRef } from "react";
import styles from "./DBMS.module.scss";
import HeaderCell from "@/app/components/HeaderCell/HeaderCell";
import ConnectionsCell from "@/app/components/ConnectionsCell/ConnectionsCell";
import TableCell from "@/app/components/TableCell/TableCell";
import Dialog from "@/app/components/Dialog/Dialog";
import EditorComp from "../components/EditorComp/EditorComp";

import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

function DBMS() {
  const [topHeight, setTopHeight] = useState(50); // Initial height as percentage
  const contentAreaRef = useRef<HTMLDivElement | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showSQL, setShowSQL] = useState(true);

  const settings = useSelector((state: RootState) => state.settings);

  const handleMouseMove = (e: MouseEvent) => {
    if (contentAreaRef.current) {
      const contentAreaHeight =
        contentAreaRef.current.getBoundingClientRect().height;
      const newHeight =
        ((e.clientY - contentAreaRef.current.offsetTop) / contentAreaHeight) *
        100;

      if (newHeight > 0 && newHeight < 100) {
        setTopHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = ""; // Enable text selection

    if (contentAreaRef.current) {
      contentAreaRef.current.classList.remove(styles["no-transition"]);
    }
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none"; // Disable text selection during drag

    if (contentAreaRef.current) {
      contentAreaRef.current.classList.add(styles["no-transition"]);
    }
  };

  useEffect(() => {
    if (settings.showSQLEditor) {
      setShowSQL(true);
    } else {
      setShowSQL(false);
    }
  }, [settings.showSQLEditor]);

  return (
    <>
      <div className={`${styles.container} ${showDialog ? styles.blur : ""}`}>
        <div className={styles.headerCell}>
          <HeaderCell />
        </div>
        <div className={styles.leftCell}>
          <ConnectionsCell />
        </div>
        <div className={styles.rightCell}>Right Cell</div>
        <div className={styles.contentCell} ref={contentAreaRef}>
          <div
            className={styles.topContentCell}
            style={{
              height: showSQL ? `calc(${topHeight}% - 5px)` : "100%",
              flexGrow: "0",
            }}
          >
            <TableCell />
          </div>

          {showSQL && (
            <>
              <div
                className={styles["drag-divider"]}
                onMouseDown={handleMouseDown}
              ></div>

              <div
                className={styles.bottomContentCell}
                style={{
                  height: `calc(${100 - topHeight}% - 5px)`,
                  flexGrow: "0",
                }} // Subtracting half of drag-divider's height
              >
                <EditorComp />
              </div>
            </>
          )}
        </div>
      </div>
      <Dialog />
    </>
  );
}

export default DBMS;
