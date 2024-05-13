import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from '../styles/Findchat.module.scss';
import {useNavigate} from "react-router-dom";
import {Avatar} from '@chakra-ui/react';


interface User {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    birthday: string;
    introduction: string;
    residence: string;
    learning_language: string;
    spoken_language: string;
    custom_id: number;
    followers: User[];
    following_users: User[];
    follower_count: number;
    following_count: number;
    post_count: number;
}

function Findchat() {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`http://127.0.0.1:3000/users/random`);
                    setUsers(response.data);
                    console.log(response.data)
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
        fetchUsers()
    }, []);

    const handleUserClick = (user: User) => {
        navigate(`/user/${user.custom_id}`);
    };

    return (
        <div>
            <ul>
                {users.map((user: User) => (
                    <li key={user.id}>
                        <div className={styles.myprofile} onClick={() => handleUserClick(user)}>
                            <div className={styles.component}>
                                <div className={styles.top}>
                                    <div className={styles.introduce}>
                                        <div>
                                            {user.avatar_url ? ( // Check if avatar_url exists
                                                <img className={styles.avatar}
                                                     src={`http://localhost:3000${user.avatar_url}`}
                                                     alt="Avatar"/>
                                            ) : (
                                                <Avatar name={user.name}
                                                        style={{width: '200px', height: '200px'}}/> // Render Chakra UI Avatar if avatar_url doesn't exist
                                            )}
                                        </div>
                                        <div className={styles.info}>
                                            <div className={styles.follow}>
                                                <p>フォロー:{user.following_count}</p>
                                                <p>フォロワー:{user.follower_count}</p>
                                                <p>投稿:{user.post_count}</p>
                                            </div>
                                            <div className={styles.user}>
                                                <p>{user.name}</p>
                                                <p>話せる言語:{user.spoken_language}</p>
                                                <p>学びたい言語:{user.learning_language}</p>
                                                <p>住んでいる国:{user.residence}</p>
                                                <p>自己紹介:{user.introduction}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Findchat;
