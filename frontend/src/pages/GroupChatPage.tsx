import Sidebar from '../components/Sidebar';
import GroupChat from '../components/GroupChat';
import styles from '../styles/GroupChatPage.module.scss';

function GroupChatPage() {
    return (
        <div className={styles.group_chat}>
            <Sidebar />
            <GroupChat />
        </div>
    );
}

export default GroupChatPage;