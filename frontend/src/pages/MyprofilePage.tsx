import React from 'react'
import Sidebar from '../components/Sidebar'
import Myprofile from '../components/Myprofile'
import styles from '../styles/MyprofilePage.module.scss'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

function MyprofilePages() {
    const token = useSelector((state: RootState) => state.auth.token);
    useEffect(() => {
        console.log("myprof", token);
    }, []);

    return (
        <div className={styles.my_profile}>
            <Sidebar />
            <div className={styles.main_content}>
                <Myprofile />
            </div>
        </div>
    );
}

export default MyprofilePages;
