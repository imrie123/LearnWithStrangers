import React from 'react'
import Sidebar from '../components/Sidebar'
import Findchat from '../components/Findchat'
import styles from '../styles/FindchatPage.module.scss'

function FindchatPage() {
    return (
        <div className={styles.findchat_page}>
            <Sidebar/>
            <Findchat/>
        </div>
    )
}

export default FindchatPage
