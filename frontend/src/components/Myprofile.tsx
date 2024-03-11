import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // useParamsとLinkを一緒にインポート
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Card, Flex, Avatar, Text, Image, Button, CardBody, CardFooter } from '@chakra-ui/react';
import { BiChat, BiShare } from 'react-icons/bi';
import EditIcon from '@mui/icons-material/Edit';
import styles from '../styles/Myprofile.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
    post_id: number;
    liked: boolean;
}

function MyProfile() {
    const [user, setUser] = useState({
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...',
        custom_id: 'Loading...'
    });
    const [posts, setPosts] = useState<Post[]>([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me/posts?token=${token}`)
                .then((response) => {
                    setPosts(response.data.posts);
                })
                .catch((error) => {
                    console.error("Error fetching posts:", error);
                });
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me?token=${token}`)
                .then((response) => {
                    setUser(response.data.user);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);

    const deletePost = (post_id: number) => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.delete(`http://127.0.0.1:3000/users/me/posts/${post_id}?token=${token}`)
                .then(() => {
                    setPosts(prevPosts => prevPosts.filter(post => post.post_id !== post_id));
                })
                .catch((error) => {
                    console.error("Error deleting post:", error);
                });
        }
    };

    return (
        <div className={styles.myprofile}>
            <div className={styles.component}>
                <div className={styles.top}>
                    <div className={styles.introduce}>
                        <img className={styles.avatar} src={`http://localhost:3000${user.avatar_url}`} alt="avatar" />
                        <div className={styles.info}>
                            <div className={styles.follow}>
                                <p>フォロー:100</p>
                                <p>フォロワー:100</p>
                                <p>投稿:20</p>
                                <Link to="/setting">
                                    <SettingsIcon />
                                </Link>
                            </div>

                            <div className={styles.user}>
                                <p>{user.name}</p>
                                <p>@{user.custom_id}</p>
                                <p>話せる言語:{user.spoken_language}</p>
                                <p>学びたい言語:{user.learning_language}</p>
                                <p>住んでいる国:{user.residence}</p>
                                <p>自己紹介:{user.introduction}</p>

                            </div>
                            <Link to="/addpost">
                                <AddCircleOutlineIcon />
                            </Link>
                            <div className={styles.user_posts}>
                                {posts.map(post => (
                                    <Card key={post.post_id} maxW='md' mb={4}>
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
                                                <Link to={`/editpost/${post.post_id}`}>
                                                    <EditIcon />
                                                </Link>
                                                <Button variant='ghost' >
                                                    <FavoriteIcon />
                                                </Button>
                                                <Button variant='ghost' leftIcon={<BiChat />}>
                                                    コメント
                                                </Button>
                                                <Button variant='ghost' leftIcon={<BiShare />}>
                                                    シェア
                                                </Button>
                                                <Button onClick={() => deletePost(post.post_id)}>
                                                    削除
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
    );
}

export default MyProfile;
