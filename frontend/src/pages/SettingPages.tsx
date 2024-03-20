import React from 'react';
import Setting from "../components/Setting";
import Sidebar from "../components/Sidebar";
import styles from "../styles/SettingPages.module.scss";

function SettingPages() {
  return (
    <div className={styles.editpage}>
      <Sidebar />
      <Setting />


    </div>
  )
}
export default SettingPages;