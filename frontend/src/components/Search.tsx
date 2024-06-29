import React, {useState, useEffect} from 'react';
import {Stack, Input, Select} from '@chakra-ui/react';
import axios from 'axios';
import styles from '../styles/Findchat.module.scss';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../services/axiosInstance.js';
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
                const response = await axiosInstance.get(`/users/search`, {
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
                        placeholder="Select search criteria"
                        width="500px"
                        borderRadius="10px"
                        value={selectedCriteria}
                        onChange={(e) => setSelectedCriteria(e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="custom_id">Id</option>
                        <option value="residence">Residence</option>
                        <option value="learning_language">Learning Language</option>
                        <option value="spoken_language">Spoken Language</option>
                    </Select>
                    <Input
                        variant="filled"
                        placeholder="Search"
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
                                                <p>Following: {user.following_count}</p>
                                                <p>Followers: {user.follower_count}</p>
                                                <p>Posts: {user.post_count}</p>
                                            </div>
                                            <div className={styles.myprofile_footer}>
                                                <div className={styles.user}>
                                                    <p>{user.name}</p>
                                                    <p>@{user.custom_id}</p>
                                                    <p>Spoken Language: {user.spoken_language}</p>
                                                    <p>Learning Language: {user.learning_language}</p>
                                                    <p>Residence: {user.residence}</p>
                                                    <p>Introduction: {user.introduction}</p>
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
