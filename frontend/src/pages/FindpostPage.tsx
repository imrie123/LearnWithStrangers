import React from 'react'
import Sidebar from '../components/Sidebar'
import Findpost from '../components/Findpost'
import styles from '../styles/FindpostPage.module.scss'

function FindpostPage() {
  return (
    <div className={styles.findpostPage}>
      <Sidebar/>
        <div className={styles.findpost}>
      <Findpost/>
    </div>
    </div>
  )
}

export default FindpostPage
