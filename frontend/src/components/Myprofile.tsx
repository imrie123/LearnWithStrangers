import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';


function MyProfile() {
    const [user, setUser] = useState({ name: 'Loading...' });

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
            <p>{user.name}</p>
        </div>
    );
}

export default MyProfile;
