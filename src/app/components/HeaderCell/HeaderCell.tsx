import React from "react";
import styles from "./HeaderCell.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { openDialog } from "@/store/slices/dialogSlice";

import { SlQuestion } from "react-icons/sl";
import { IoMdSettings } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";

import ToolTip from "@/app/components/ToolTip/ToolTip";

import ProfileSettings from "../ProfileSettings/ProfileSettings";

function HeaderCell() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  var username = user.username ? user.username : "User";

  const handleOpenDialog = (content: JSX.Element) => () => {
    dispatch(
      openDialog(
        <div>
          <div>{content}</div>
        </div>
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerTitle}>
        Welcome to <p className={styles.headerTitleInline}>AERO</p>, {username}.
      </div>
      <div className={styles.headerCell}>
        <ToolTip message="About">
          <SlQuestion
            className={styles.icon}
            size={30}
            onClick={handleOpenDialog(<div>About</div>)}
          />
        </ToolTip>
        <ToolTip message="Feedback">
          <VscFeedback
            className={styles.icon}
            size={30}
            onClick={handleOpenDialog(<div>Feedback</div>)}
          />
        </ToolTip>
        <ToolTip message="Settings">
          <IoMdSettings
            className={styles.icon}
            size={30}
            onClick={handleOpenDialog(<div>Settings</div>)}
          />
        </ToolTip>
        <ToolTip message="Profile">
          {username === "User" ? (
            <FaRegUserCircle
              className={styles.icon}
              size={30}
              onClick={handleOpenDialog(<ProfileSettings />)}
            />
          ) : (
            <div
              className={styles.userLetter}
              onClick={handleOpenDialog(<ProfileSettings />)}
            >
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </ToolTip>
      </div>
    </div>
  );
}

export default HeaderCell;
