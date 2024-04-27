import React, {useRef, useState} from 'react';
import axios from 'axios';
import {Input, FormControl} from '@chakra-ui/react';
import styles from '../styles/AddCommentButton.module.scss';

interface AddCommentButtonProps {
    post_id: number;
}

function AddCommentButton(props: AddCommentButtonProps) {
    const [inputContent, setInputContent] = useState('');
    const initialRef = useRef<HTMLInputElement | null>(null); // initialRefを追加
    const {post_id} = props;
    const handleSave = () => {
        const token = localStorage.getItem('token')
        axios.post(`http://127.0.0.1:3000/posts/${props.post_id}/comments`, {
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