import { Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import styles from '../styles/AddpostPage.module.scss';

function AddpostPage() {
    const [inputContent, setInputContent] = useState('');

    const upload = (formData: FormData) => {
        const token = localStorage.getItem('token');
        axios.post(`http://127.0.0.1:3000/users/:user_id/posts`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput && fileInput.files) {
            formData.append('post[image]', fileInput.files[0]);
            formData.append('post[content]', inputContent);
            upload(formData);
        }
    };

    return (
        <div className={styles.add_post}>
            <Sidebar />
            <div className={styles.main_content}>
                <h1>AddpostPage</h1>
                <h2>投稿を追加</h2>
                <form onSubmit={handleSubmit}>
                    <Input type="text" value={inputContent} onChange={e => setInputContent(e.target.value)}/>
                    <Input type="file" accept="image/*"/>
                    <button type="submit">投稿</button>
                </form>
            </div>
            </div>
            );
            }

            export default AddpostPage;
