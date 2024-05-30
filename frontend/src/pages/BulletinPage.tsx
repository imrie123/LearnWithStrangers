import React from 'react';
import Bulletin from '../components/Bulletin';
import Sidebar from '../components/Sidebar';
import styles from '../styles/BulletinPage.module.scss';

function BulletinPage() {
    return (
        <div className={styles.bulletin_page}>
            <Sidebar/>
            <div className={styles.bulletin}>
                <Bulletin/>
            </div>
        </div>
    );
}

export default BulletinPage;