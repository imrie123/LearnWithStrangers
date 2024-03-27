import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import styles from '../styles/Myprofile.module.scss';
import {Card, CardBody, CardFooter, Flex, Text, Button, Image, Avatar} from '@chakra-ui/react';
import {BiChat, BiShare} from 'react-icons/bi';
import FavoriteIcon from '@mui/icons-material/Favorite';


interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
    post_id: number;
    user_id: number;
    likes_count: number;
    liked_by_current_user: boolean;
    liked_by_current_user_id: number;
}

const OtherUserProfile = () => {
    const [user, setUser] = useState({
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...',
        custom_id: 'Loading...',
        user_id: null,
        followed_by_current_user: false,
    });

    const [posts, setPosts] = useState<Post[]>([]);
    const [postLikes, setPostLikes] = useState<{ [post_id: number]: number }>({});
    const [id, setId] = useState<number | null>();
    const {custom_id} = useParams<{ custom_id: string }>();

    const handleFollow = () => {
        const token = localStorage.getItem('token');

        axios.post(`http://127.0.0.1:3000/users/${custom_id}/relationships?token=${token}`)
            .then((response) => {
                console.log(response.data);
                setUser({...user, followed_by_current_user: true});
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const handleUnFollow = () => {
        const token = localStorage.getItem('token');

        axios.delete(`http://127.0.0.1:3000/users/${custom_id}/relationships?token=${token}`)
            .then((response) => {
                console.log(response.data);
                setUser({...user, followed_by_current_user: false});
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const handleLike = (post_id: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is missing');
            return;
        }

        axios.post(`http://127.0.0.1:3000/users/${custom_id}/posts/${post_id}/likes?token=${token}`)
            .then((response) => {
                const likedPostIndex = posts.findIndex((post: Post) => post.post_id === post_id);
                posts[likedPostIndex].liked_by_current_user = true;
                setPosts(() => posts);
                setId(response.data.id);
                setPostLikes(prevPostLikes => ({
                    ...prevPostLikes,
                    [post_id]: (prevPostLikes[post_id] || 0) + 1
                }));

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleUnlike = (post_id: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is missing');
            return;
        }

        axios.delete(`http://127.0.0.1:3000/users/${custom_id}/posts/${post_id}/likes/${id}?token=${token}`)
            .then(() => {
                const unlikedPostIndex = posts.findIndex((post: Post) => post.post_id === post_id);
                posts[unlikedPostIndex].liked_by_current_user = false;
                setPosts([...posts])
                setPostLikes(prevPostLikes => ({
                    ...prevPostLikes,
                    [post_id]: Math.max((prevPostLikes[post_id] || 0) - 1, 0)
                }));
            })
            .catch((error) => {
                console.error('Error in unlike:', error);
            });
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://127.0.0.1:3000/users/${custom_id}?token=${token}`)
            .then((response) => {
                setUser(response.data.user);
                console.log(response.data.user);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        axios.get(`http://127.0.0.1:3000/users/${custom_id}/posts?token=${token}`)
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
                                <Button onClick={user.followed_by_current_user ? handleUnFollow : handleFollow}
                                        colorScheme={user.followed_by_current_user ? "gray" : "blue"}>フォローする</Button>
                            </div>

                            <div className={styles.user_posts}>
                                {posts.map(post => (
                                    <Card key={post.post_id} maxW='4xl' mb={4}>
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
                                                <Button
                                                    variant='ghost'
                                                    colorScheme={post.liked_by_current_user ? "red" : "gray"} // レスポンスに基づいて色を設定
                                                    onClick={() => post.liked_by_current_user ? handleUnlike(post.post_id) : handleLike(post.post_id)} // レスポンスに基づいて処理を実行
                                                >
                                                    <FavoriteIcon/>
                                                    {postLikes[post.post_id] ?? post.likes_count}
                                                </Button>

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
