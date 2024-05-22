import React, {useEffect, useState, FormEvent} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import styles from '../styles/ChatRoom.module.scss';
import {
    FormControl,
    Input,
    Button,
    Avatar
} from '@chakra-ui/react';


interface Room {
    name: string;
    room_id: number;
    messages: Message[];
}

interface Message {
    message_id: number;
    user: {
        name: string;
        avatar_url: string;
    };
    content: string;
    created_at: string;
}

function ChatRoom() {
    const [room, setRoom] = useState<Room>({name: '', room_id: 0, messages: []});
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const {custom_id, name, id} = useParams<{ custom_id: string; name: string; id: string }>();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/rooms/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    console.log(response.data);
                    setRoom(response.data);
                    setMessages(response.data.room.messages);
                    console.log(response.data.room.messages);

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [custom_id, name]);


    const handleMessageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.post(`http://127.0.0.1:3000/rooms/${id}/messages`, {
                    message: {content: message},
                }, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log(response.data);
                setMessages(prevMessages => [...prevMessages, response.data]);
                setMessage('');
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }


    return (
        <div className={styles.chat_room}>
            <div className={styles.top}>
                <h1>{room.name}</h1>
            </div>

            <div className={styles.message}>
                <ul>
                    {messages && messages.map((message: Message) => (
                        <li key={message.message_id}>
                            <div className={styles.message_list}>
                                {message.user ? (
                                    <Avatar src={message.user.avatar_url} name={message.user.name}
                                            className={styles.avatar}/>
                                ) : (
                                    <Avatar name="Unknown" className={styles.avatar}/>
                                )}
                                <div className={styles.balloon}>
                                    <p className={styles.name}>{message.user.name}</p>
                                    <p className={styles.message}>{message.content}</p>
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
