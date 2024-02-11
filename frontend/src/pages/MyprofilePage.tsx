import React from 'react'
import Sidebar from '../components/Sidebar'
import Myprofile from '../components/Myprofile'
import styles from '../styles/MyprofilePage.module.scss'
function MyprofilePages() {
  return (
    <div className={styles.my_profile}>
      <Sidebar/>
      <Myprofile/>
    </div>
  )
}

export default MyprofilePages
