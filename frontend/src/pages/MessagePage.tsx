import Sidebar from "../components/Sidebar";
import React from "react";
import Message from "../components/Message";
import styles from "../styles/MessagePage.module.scss";

function MessagePage() {
  return (
    <div className={styles.message_page}>
        <Sidebar />
        <Message />
    </div>
  );
}
export default MessagePage;