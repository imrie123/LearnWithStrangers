import React, {useRef, useState, FormEventHandler} from 'react';
import {Input, FormControl} from '@chakra-ui/react';
import styles from '../styles/AddCommentButton.module.scss';
import axiosInstance from '../services/axiosInstance';

interface AddCommentButtonProps {
    post_id: number;
}

function AddCommentButton({post_id}: AddCommentButtonProps) {
    const [inputContent, setInputContent] = useState('');
    const initialRef = useRef<HTMLInputElement | null>(null); // initialRefを追加

    const handleSave: FormEventHandler<HTMLFormElement> = (e) => {
        const token = localStorage.getItem('token')
        if (!token) {
            console.error('token is not found');
            return;
        }
        axiosInstance.post(`/posts/${post_id}/comments`, {
            post_id: post_id,
            content: inputContent
        }, {
            headers: {Authorization: `Bearer ${token}`},
            responseType: 'json'
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            <div className={styles.comment_input}>
                <form onSubmit={handleSave}>
                    <FormControl>
                        <Input type="text" value={inputContent} onChange={e => setInputContent(e.target.value)}
                               ref={initialRef}
                               autoFocus={true}
                               focusBorderColor="gray.300"/>
                    </FormControl>
                </form>
            </div>
        </>
    )
}

export default AddCommentButton;