// src/app/components/Dialog/Dialog.tsx
"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { closeDialog } from "@/store/slices/dialogSlice";
import styles from "./Dialog.module.scss";
import { IoMdClose } from "react-icons/io";

const Dialog: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, content } = useSelector((state: RootState) => state.dialog);

  if (!isOpen) return null;

  return (
    <div
      className={styles.dialogOverlay}
      onClick={() => dispatch(closeDialog())}
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={() => dispatch(closeDialog())}
        >
          <IoMdClose size={30} className={styles.closeIcon} />
        </button>
        {content}
      </div>
    </div>
  );
};

export default Dialog;
