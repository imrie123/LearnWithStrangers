import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from '../styles/Myprofile.module.scss';
import { Card, CardBody, CardFooter, Flex, Text, Button, Image, Avatar } from '@chakra-ui/react';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';

interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
    post_id: number;
}

const OtherUserProfile = () => {
    const [user, setUser] = useState({
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...',
        custom_id: 'Loading...'
    });
    const { custom_id } = useParams<{ custom_id: string }>();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:3000/users/custom/${custom_id}`)
            .then((response) => {
                setUser(response.data.user);
                console.log(response.data.user);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        axios.get(`http://127.0.0.1:3000/users/posts/${custom_id}`)
            .then((response) => {
                setPosts(response.data.posts);
                console.log(response.data.posts);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [custom_id]);

    return (
        <div className={styles.myprofile}>
            <div className={styles.component}>
                <div className={styles.top}>
                    <div className={styles.introduce}>
                        <img className={styles.avatar} src={`http://localhost:3000${user.avatar_url}`} alt="avatar"/>
                        <div className={styles.info}>
                            <div className={styles.follow}>
                                <p>フォロー:100</p>
                                <p>フォロワー:100</p>
                                <p>投稿:20</p>
                            </div>
                            <div className={styles.user}>
                                <p>{user.name}</p>
                                <p>@{user.custom_id}</p>
                                <p>話せる言語:{user.spoken_language}</p>
                                <p>学びたい言語:{user.learning_language}</p>
                                <p>住んでいる国:{user.residence}</p>
                                <p>自己紹介:{user.introduction}</p>
                            </div>
                            <div className={styles.user_posts}>
                                {posts.map(post => (
                                    <Card key={post.id} maxW='md' mb={4}>
                                        <Flex direction="column" align="center" justify="center" p={4}>
                                            <Flex align="flex-start" mb={4}>
                                                <Avatar src={`http://localhost:3000${user.avatar_url}`} mr={4}/>
                                                <Text fontWeight='bold'>{user.name}</Text>
                                            </Flex>
                                            <Image objectFit='cover' src={post.image_url} alt='Post Image'/>
                                            <CardBody>
                                                <Text>{post.content}</Text>
                                            </CardBody>
                                            <CardFooter display='flex' justifyContent='space-between' p={4}>
                                                <Button variant='ghost' leftIcon={<BiLike/>}>いいね</Button>
                                                <Button variant='ghost' leftIcon={<BiChat/>}>コメント</Button>
                                                <Button variant='ghost' leftIcon={<BiShare/>}>シェア</Button>
                                            </CardFooter>
                                        </Flex>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OtherUserProfile;
