import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import {Link} from "react-router-dom";


function MyProfile() {
    const [user, setUser] = useState({ name: 'Loading...', learning_language: 'Loading...', spoken_language: 'Loading...' , residence: 'Loading...', introduction: 'Loading...'});



    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.post('http://127.0.0.1:3000/users/show', {token})
                .then((response) => {
                    setUser(response.data.user);
                    console.log(response.data.user);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, []);

    return (
        <div>
            <Link to="/setting" >
                <SettingsIcon />
            </Link>

            <p>{user.name}</p>
            <p>話せる言語:{user.spoken_language}</p>
            <p>学びたい言語:{user.learning_language}</p>
            <p>住んでいる国:{user.residence}</p>
            <p>自己紹介:{user.introduction}</p>




        </div>
    );
}

export default MyProfile;
