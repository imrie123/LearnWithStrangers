import OtherUserProfile from '../components/OtherUserProfile';
import Sidebar from '../components/Sidebar';
import styles from '../styles/OtherUserProfilePage.module.scss';


function OtherUserProfilePage() {
    return (
        <div className={styles.other_user_profile_page}>
            <Sidebar/>
            <OtherUserProfile/>
        </div>
    );
}

export default OtherUserProfilePage;