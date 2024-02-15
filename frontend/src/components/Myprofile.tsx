import React, {useEffect} from 'react';
import axios from 'axios';
import {useState} from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import {Link} from "react-router-dom";
import styles from "../styles/Myprofile.module.scss";
import {Button} from "@chakra-ui/react";



function MyProfile() {
    const [user, setUser] = useState({name: 'Loading...', learning_language: 'Loading...', spoken_language: 'Loading...', residence: 'Loading...', introduction: 'Loading...', avatar_url: 'Loading...'});
    const [avatar_url, setAvatarUrl] = useState();


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me?token=${token}`)
                .then((response) => {
                    setUser(response.data.user);
                    console.log(response.data.user);
                    setAvatarUrl(response.data.avatar_url);
                    console.log(response.data.user);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, []);

    return (
        <>
        <div className={styles.myprofile}>
            <div className={styles.component}>
                <div className={styles.top}>

                    <div className={styles.introduce}>

                        <img src={`http://localhost:3000${user.avatar_url}`} alt="avatar"/>


                        <div className={styles.info}>
                            <div className={styles.follow}>
                                <p>フォロー:100</p>
                                <p>フォロワー:100</p>
                                <p>投稿:20</p>
                                <Link to="/setting">
                                    <SettingsIcon/>
                                </Link>
                            </div>
                            <div className={styles.user}>
                                <p>{user.name}</p>
                                <p>話せる言語:{user.spoken_language}</p>
                                <p>学びたい言語:{user.learning_language}</p>
                                <p>住んでいる国:{user.residence}</p>
                                <p>自己紹介:{user.introduction}</p>

                            </div>
                            <Button>
                                フォロー
                            </Button>
                        </div>


                    </div>

                </div>
            </div>
        </div>


        </>

    );
}

export default MyProfile;
