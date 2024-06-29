import React, {useEffect, useState, FormEvent} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Card, CardFooter, Avatar, Flex, Image, Text, Input, Button} from '@chakra-ui/react';
import styles from '../styles/Editpost.module.scss';
import axiosInstance from '../services/axiosInstance';

interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
    post_id: number;
}

function Editpost() {
    const {post_id} = useParams<{ post_id: string }>();
    const [inputContent, setInputContent] = useState('');
    const [post, setPost] = useState<Post | null>(null);
    const [user, setUser] = useState({
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...'
    });
    const [avatar_url, setAvatarUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axiosInstance.get(`/users/me?token=${token}`)
                .then((response) => {
                    const {user, avatar_url} = response.data; // Destructuring user and avatar_url from response.data
                    setUser(user);
                    setAvatarUrl(avatar_url);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && post_id) {
            axiosInstance.get(`/users/:user_id/posts/${post_id}?token=${token}`)
                .then((response) => {
                    const postData = response.data.posts[0];
                    setInputContent(postData.content);
                    setPost(postData);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [post_id]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token && post_id) {
            axiosInstance.put(`/users/:user_id/posts/${post_id}?token=${token}`, {content: inputContent})
                .then((response) => {
                    setPost(response.data.posts); // Assuming response.data.posts contains the updated post
                    navigate('/'); // Redirecting to home page after successful submit
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div>
            <h1>Edit Post</h1>
            {post && (
                <Card key={post.id} maxW='md' mb={4}>
                    <Flex direction="column" align="center" justify="center" p={4}>
                        <Flex align="flex-start" mb={4}>
                            <Avatar src={`http://localhost:3000${avatar_url}`} mr={4}/>
                            <Text fontWeight='bold'>{user.name}</Text>
                        </Flex>
                        <Image
                            objectFit='cover'
                            src={post.image_url}
                            alt='Post Image'
                        />
                        <CardFooter display='flex' justifyContent='space-between' p={4}>
                            <form className={styles.input}>
                                <Input type="text" value={inputContent}
                                       onChange={(e) => setInputContent(e.target.value)}/>
                                <Button colorScheme='blue' onClick={handleSubmit}>Submit</Button>
                            </form>
                        </CardFooter>
                    </Flex>
                </Card>
            )}
        </div>
    );
}

export default Editpost;
