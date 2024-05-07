import React from 'react'
import Sidebar from '../components/Sidebar'
import Findgroup from '../components/Findgroup'
import styles from '../styles/FindgroupPage.module.scss'

function FindgroupPages() {
  return (
    <div　className={styles.findgroup_page}>
      <Sidebar/>
      <Findgroup/>
    </div>
  );
}

export default FindgroupPages;
