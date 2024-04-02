import Sidebar from '../components/Sidebar';
import ChatRoom from '../components/ChatRoom';
import styles from '../styles/ChatPage.module.scss';

function ChatPage() {


    return (
        <div className={styles.ChatPage}>
            <Sidebar/>
            <ChatRoom/>
        </div>
    );
}

export default ChatPage;