import React, {useEffect} from 'react';
import axios from 'axios';
import {useState} from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import {Link} from "react-router-dom";
import styles from "../styles/Myprofile.module.scss";
import {Button} from "@chakra-ui/react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import {Avatar, Box, Flex, Heading, IconButton, Image, Text} from '@chakra-ui/react'
import {BiChat, BiLike, BiShare} from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs';



interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
}
function MyProfile() {
    const [user, setUser] = useState({name: 'Loading...', learning_language: 'Loading...', spoken_language: 'Loading...', residence: 'Loading...', introduction: 'Loading...', avatar_url: 'Loading...'});
    const [avatar_url, setAvatarUrl] = useState();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');

        if (token) {
            axios.get(`http://127.0.0.1:3000/users/:user_id/posts?token=${token}`)
                .then((response) => {

                    console.log(response.data.posts);
                    console.log(response.data);
                    setPosts(response.data.posts);
                })
                .catch((error) => {
                    console.error("Error:", error);
                }
                );
        }
    }
    , []);

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

                        <img className={styles.avatar} src={`http://localhost:3000${user.avatar_url}`} alt="avatar"　/>


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





                            <div className={styles.user_posts}>
                                {posts.map(post => (
                                    <Card key={post.id} maxW='md' mb={4}>
                                        <Flex direction="column" align="center" justify="center" p={4}>
                                            <Flex align="flex-start" mb={4}>
                                                <Avatar src={`http://localhost:3000${user.avatar_url}`} mr={4} />
                                                <Text fontWeight='bold'>{user.name}</Text>
                                            </Flex>
                                            <Image
                                                objectFit='cover'
                                                src={post.image_url}
                                                alt='Post Image'
                                            />
                                            <CardBody>
                                                <Text>{post.content}</Text>

                                            </CardBody>
                                            <CardFooter
                                                display='flex'
                                                justifyContent='space-between'
                                                p={4}
                                            >
                                                <Button variant='ghost' leftIcon={<BiLike />}>
                                                    いいね
                                                </Button>
                                                <Button variant='ghost' leftIcon={<BiChat />}>
                                                    コメント
                                                </Button>
                                                <Button variant='ghost' leftIcon={<BiShare />}>
                                                    シェア
                                                </Button>
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


        </>

    );
}

export default MyProfile;
