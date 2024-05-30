import React from 'react';
import Bulletinboard from '../components/Bulletinboard';
import Sidebar from '../components/Sidebar';
import styles from '../styles/BulletinBoardPage.module.scss';

function BulletinBoardPage() {
    return (
        <div className={styles.bulletin_page}>
            <Sidebar/>
            <div className={styles.bulletin}>
                <Bulletinboard/>
            </div>

        </div>
    );
}

export default BulletinBoardPage;

