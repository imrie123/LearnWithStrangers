import React from 'react'
import Sidebar from '../components/Sidebar'
import Findpost from '../components/Findpost'
import styles from '../styles/FindpostPage.module.scss'

function FindpostPage() {
  return (
    <div className={styles.findpost}>
      <Sidebar/>
      <Findpost/>
    </div>
  )
}

export default FindpostPage
