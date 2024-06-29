import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import styles from '../styles/ChatRoom.module.scss';
import {FormControl, Input, Button} from '@chakra-ui/react';
import {Avatar, AvatarGroup} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/react'
import style from '../styles/GroupChat.module.scss';
import axiosInstance from '../services/axiosInstance';

interface chatGroup {
    name: string;
    users: [];
    owner: {
        name: string;
        image: string;
        custom_id: string;
    }
    messages: Message[];
}

interface Message {
    message_id: number;
    user: {
        name: string;
        avatar_url: string;
        image: string;

    };
    content: string;
    created_at: string;

}

function GroupChat() {
    const [chatGroup, setChatGroup] = useState<chatGroup>({
        name: '',
        users: [],
        owner: {name: '', image: '', custom_id: ''},
        messages: []
    });
    const {id} = useParams<{ id: string }>();
    const group_id = id;
    const [message, setMessage] = useState('');
    const {isOpen, onOpen, onClose} = useDisclosure();

    const handleMessageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axiosInstance.post(`/groups/${group_id}/groups_messages`, {
                    groups_messages: {content: message},
                }, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log(response.data);
                setChatGroup(prevChatGroup => ({
                    ...prevChatGroup,
                    messages: [...prevChatGroup.messages, response.data]
                }));
                setMessage('');
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.get(`/groups/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    console.log(response.data);
                    setChatGroup(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching groups:", error);
                });
        }
    }, []);


    return (
        <div className={styles.chat_room}>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Members</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {chatGroup.users.map((user: any) => (
                            <Link to={`/user/${user.custom_id}`}>
                                <div key={user.custom_id} className={style.group_member}>
                                    <div><Avatar name={user.name} src={user.image}/></div>
                                    <div><p>{user.name}</p></div>
                                </div>
                            </Link>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className={styles.top}>
                <h1>{chatGroup.name}</h1>
                <AvatarGroup size='md' max={2} onClick={onOpen}>
                    <Avatar name={chatGroup.owner.name} src={chatGroup.owner.image}/>
                    {chatGroup.users.map((user: any) => (
                        <div key={user.custom_id}>
                            <Avatar name={user.name} src={user.image}/>
                        </div>
                    ))}
                </AvatarGroup>
            </div>
            <div className={styles.message}>
                <ul>
                    {chatGroup.messages.map((message: Message) => (
                        <li key={message.message_id}>
                            <div className={styles.message_list}>
                                <img className={styles.avatar} src={message.user.image} alt="avatar"/>
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
                            <Button type='submit'>Submit</Button>
                        </div>
                    </FormControl>
                </form>
            </div>
        </div>
    );
}

export default GroupChat;