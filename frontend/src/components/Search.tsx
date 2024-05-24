import React, {useState, useEffect} from 'react';
import {Stack, Input, Select} from '@chakra-ui/react';
import axios from 'axios';
import styles from '../styles/Findchat.module.scss';
import {useNavigate} from 'react-router-dom';

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

function Search() {
    const [inputValue, setInputValue] = useState('');
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [selectedCriteria, setSelectedCriteria] = useState<string>('name'); // Default criteria
    const navigate = useNavigate();

    useEffect(() => {
        const performSearch = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://127.0.0.1:3000/users/search`, {
                    params: {query: inputValue, criteria: selectedCriteria},
                    headers: {Authorization: `Bearer ${token}`}
                });
                setSearchResult(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        // Perform search when inputValue or selectedCriteria changes
        performSearch();
    }, [inputValue, selectedCriteria]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleUserClick = (user: User) => {
        navigate(`/user/${user.custom_id}`);
    };

    return (
        <div>
            <form className={styles.input}>
                <Stack spacing={3}>
                    <Select
                        placeholder="検索条件を選択"
                        width="500px"
                        borderRadius="10px"
                        value={selectedCriteria}
                        onChange={(e) => setSelectedCriteria(e.target.value)}
                    >
                        <option value="name">名前</option>
                        <option value="custom_id">id</option>
                        <option value="residence">住所</option>
                        <option value="learning_language">学習言語</option>
                        <option value="spoken_language">話せる言語</option>
                    </Select>
                    <Input
                        variant="filled"
                        placeholder="検索"
                        size="md"
                        width="500px"
                        borderRadius="10px"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </Stack>
            </form>

            {searchResult.length > 0 ? (
                <div className={styles.myprofile}>
                    {searchResult.map((user: User, index: number) => (
                        <div key={index}>
                            <div className={styles.component} onClick={() => handleUserClick(user)}>
                                <div className={styles.top}>
                                    <div className={styles.introduce}>
                                        <img className={styles.avatar} src={`http://localhost:3000${user.avatar_url}`}
                                             alt="avatar"/>
                                        <div className={styles.info}>
                                            <div className={styles.follow}>
                                                <p>フォロー:{user.following_count}</p>
                                                <p>フォロワー:{user.follower_count}</p>
                                                <p>投稿:{user.post_count}</p>
                                            </div>
                                            <div className={styles.myprofile_footer}>
                                                <div className={styles.user}>
                                                    <p>{user.name}</p>
                                                    <p>@{user.custom_id}</p>
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
                        </div>
                    ))}
                </div>
            ) : (
                <div>No results found</div>
            )}
        </div>
    )
}

export default Search;
