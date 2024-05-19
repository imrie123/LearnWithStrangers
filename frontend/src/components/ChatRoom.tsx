import React, {useEffect, useState, FormEvent} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import styles from '../styles/ChatRoom.module.scss';
import {
    FormControl,
    Input,
    Button
} from '@chakra-ui/react';

interface Room {
    name: string;
    room_id: number;
}

interface Message {
    message_id: number;
    user: {
        name: string;
        avatar_url: string;
    };
    context: string;
    created_at: string;
}

function ChatRoom() {
    const [room, setRoom] = useState<Room>({name: '', room_id: 0});
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const {custom_id, name, id} = useParams<{ custom_id: string; name: string; id: string }>();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/users/${custom_id}/room/${id}`,  {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    console.log(response.data);
                    setRoom(response.data.room);
                    setMessages(response.data.messages);

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [custom_id, name]);

    const handleMessageSubmit = (e: FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://127.0.0.1:3000/users/${custom_id}/room/${id}/message?token=${token}`, {
                message: {context: message}
            })
                .then((response) => {
                    console.log(response.data);
                    // Optionally update state to reflect the new message
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        setMessage('');
    };

    return (
        <div className={styles.chat_room}>
            <div className={styles.top}>
                <h1>{room.name}</h1>
            </div>

            <div className={styles.message}>
                <ul>
                    {messages.map((message: Message) => (
                        <li key={message.message_id}>
                            <div className={styles.message_list}>
                                <img className={styles.avatar} src={message.user.avatar_url} alt="avatar"/>
                                <div className={styles.balloon}>
                                    <p className={styles.name}>{message.user.name}</p>
                                    <p className={styles.message}>{message.context}</p>
                                    <p className={styles.created_at}>{message.created_at}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.bottom}>
                <form onSubmit={handleMessageSubmit}>
                    <FormControl>
                        <div className={styles.input}>
                            <Input type='text' value={message} onChange={(e) => setMessage(e.target.value)}/>
                            <Button type='submit'>送信</Button>
                        </div>
                    </FormControl>
                </form>
            </div>
        </div>
    );
}

export default ChatRoom;
