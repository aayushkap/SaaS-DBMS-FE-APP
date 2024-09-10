import React, { ReactNode, useState } from "react";
import styles from "./ToolTip.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

interface TooltipProps {
  children: ReactNode;
  message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, message }) => {
  const [visible, setVisible] = useState(false);

  const settings = useSelector((state: RootState) => state.settings);

  return (
    <>
      {settings.activeToolTip && (
        <div
          className={styles.container}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {children}
          {visible && <div className={styles.tooltip}>{message}</div>}
        </div>
      )}

      {!settings.activeToolTip && children}
    </>
  );
};

export default Tooltip;
