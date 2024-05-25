import React from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton} from "react-share";
import {Avatar, Button, Card, CardBody, CardFooter, Flex, Image, Text} from '@chakra-ui/react';
import styles from '../styles/SharePage.module.scss';
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Post {
    id: number;
    name: string;
    image_url: string;
    content: string;
    created_at: string;
    likes_count: number;
    user: {
        id: number;
        name: string;
        avatar_url: string;
        custom_id: string;
    };
    comments: any[];
}

function SharePage() {
    const {id} = useParams();
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:3000/posts/${id}`)
            .then((res) => {
                setPost(res.data);
                console.log(res.data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [id]);

    return (
        <div className={styles.share_pages}>
            <p>LearnWithStrangers</p>
            <div className={styles.user_posts}>
                {post && (
                    <Card key={post.id} maxW='4xl' mb={4} padding={15}>
                        <Flex direction="column" justify="center" p={10}>
                            <Flex align="flex-start" mb={4}>
                                <div className={styles.post_top}>
                                    <div>
                                        <Avatar src={`http://localhost:3000${post.user.avatar_url}`} mr={4}/>
                                        <Text fontWeight='bold'>{post.user.name}</Text>
                                        @{post.user.custom_id}
                                    </div>
                                    <div className={styles.top_right}>
                                        <Link to={'/'}>
                                            <Button colorScheme='blue' className={styles.learning_button}>Let's Start
                                                Learning!</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Flex>
                            <Image
                                objectFit='cover'
                                src={post.image_url}
                                alt='Post Image'
                            />
                            <p className={styles.date}>
                                {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            <CardBody className={styles.content_date}>
                                <Text>{post.content}</Text>
                            </CardBody>
                            <CardFooter
                                display='flex'
                                justifyContent='space-between'
                                p={4}
                                className={styles.button}>

                                <Button variant='ghost'>
                                    <FavoriteIcon/>
                                    {post.likes_count}
                                </Button>
                                <div className={styles.comment_button}>コメント{post.comments.length}件</div>
                                <FacebookShareButton url={`http://localhost:3001/share/${post.id}`}>
                                    <FacebookIcon size={32} round={true}/>
                                </FacebookShareButton>
                                <TwitterShareButton url={`http://localhost:3001/share/${post.id}`}>
                                    <TwitterIcon size={32} round={true}/>
                                </TwitterShareButton>
                            </CardFooter>
                            <div className={styles.comment_component}>
                                {post.comments.map((comment: any, index: number) => (
                                    <div key={index} className={styles.comment}>
                                        <div className={styles.comment_left}>
                                            <Link to={`/user/${post.user.custom_id}`}>
                                                <img className={styles.comment_avatar}
                                                     src={`http://localhost:3000${comment.avatar}`}
                                                     alt="avatar"/>
                                            </Link>
                                        </div>
                                        <div className={styles.comment_right}>
                                            <p>{comment.user_name}</p>
                                            <p key={index}>{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Flex>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default SharePage;
