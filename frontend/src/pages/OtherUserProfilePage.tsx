import OtherUserProfile from '../components/OtherUserProfile';
import Sidebar from '../components/Sidebar';
import styles from '../styles/OtherUserProfilePage.module.scss';
import { useEffect } from 'react';


function OtherUserProfilePage() {
    useEffect(() => {
        console.log("aaa");
    }, []);
    return (
        <div className={styles.other_user_profile_page}>
            <Sidebar/>
            <OtherUserProfile/>
        </div>
    );
}

export default OtherUserProfilePage;