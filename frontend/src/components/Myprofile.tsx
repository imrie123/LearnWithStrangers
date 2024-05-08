import {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Card,
    Flex,
    Avatar,
    Text,
    Image,
    Button,
    CardBody,
    CardFooter,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
} from '@chakra-ui/react';
import {BiChat, BiShare} from 'react-icons/bi';
import EditIcon from '@mui/icons-material/Edit';
import styles from '../styles/Myprofile.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddpostButton from './AddpostButton';
import AddCommentButton from './AddCommentButton';


interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
    post_id: number;
    liked: boolean;
    name: string;
    likes_count: number;
    liked_by_current_user: boolean;
    avatar_url: string;
    comments: [];
    custom_id: string;


}

function MyProfile() {
    const [user, setUser] = useState({
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...',
        custom_id: 'Loading...',
        image_url: 'Loading...',
    });
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    console.log(response.data.user.liked_posts)
                    setPosts(response.data.user.user_posts);
                    setLikedPosts(response.data.user.liked_posts);
                })
                .catch((error) => {
                    console.error("Error fetching posts:", error);
                });
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    setUser(response.data.user);
                    setPosts(response.data.user.user_posts);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);

    const deletePost = (id: number) => {
        const token = localStorage.getItem('token');
        if (token) {
            const postToDelete = posts.find(post => post.post_id === id);
            if (postToDelete) {
                axios.delete(`http://127.0.0.1:3000/posts/${postToDelete.id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                })
                    .then(() => {
                        setPosts(prevPosts => prevPosts.filter(post => post.post_id !== id));
                    })
                    .catch((error) => {
                        console.error("Error deleting post:", error);
                    });
            } else {
                console.warn("Post with id", id, "not found");
            }
        }
    };


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
                                <Link to="/setting">
                                    <SettingsIcon/>
                                </Link>
                            </div>
                            <div className={styles.myprofile_footer}>
                                <div className={styles.user}>
                                    <p>{user.name}</p>
                                    <p>@{user.custom_id}</p>
                                    <p>話せる言語:{user.spoken_language}</p>
                                    <p>学びたい言語:{user.learning_language}</p>
                                    <p>住んでいる国:{user.residence}</p>
                                    <p>自己紹介:{user.introduction}</p>
                                </div>
                                <div>
                                    <AddpostButton/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs isLazy>
                    <TabList>
                        <Tab>投稿</Tab>
                        <Tab>いいねした投稿</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <div className={styles.user_posts}>
                                {posts.map(post => (
                                    <Card key={post.id} maxW='4xl' mb={4} padding={15}>
                                        <Flex direction="column" justify="center" p={10}>
                                            <Flex align="flex-start" mb={4}>
                                                <div className={styles.post_top}>
                                                    <div>
                                                        <Avatar src={`http://localhost:3000${user.avatar_url}`} mr={4}/>
                                                        <div>
                                                            <Text fontWeight='bold'>{user.name}</Text>
                                                            @{user.custom_id}
                                                        </div>

                                                    </div>
                                                    <div>
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
                                                <div
                                                    className={styles.comment_button}>コメント{post.comments.length}件
                                                </div>


                                                <Button variant='ghost' leftIcon={<BiShare/>}>
                                                    シェア
                                                </Button>
                                                <Link to={`/editpost/${post.post_id}`}>
                                                    <EditIcon/>
                                                </Link>
                                                <Button onClick={() => deletePost(post.post_id)}>
                                                    削除
                                                </Button>
                                            </CardFooter>
                                            <div className={styles.comment_component}>
                                                {post.comments.map((comment: any, index: number) => (
                                                    <div key={index} className={styles.comment}>
                                                        <div className={styles.comment_left}>
                                                            <img className={styles.comment_avatar}
                                                                 src={`http://localhost:3000${comment.avatar}`}
                                                                 alt="avatar"/>
                                                        </div>
                                                        <div className={styles.comment_left}>
                                                            <p>{comment.user_name}</p>
                                                            <p key={index}>{comment.content}</p>
                                                        </div>

                                                    </div>

                                                ))}
                                            </div>
                                            <AddCommentButton post_id={post.id}/>
                                        </Flex>
                                    </Card>
                                ))}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className={styles.user_posts}>
                                {likedPosts.map(post => (
                                    <Card key={post.id} maxW='4xl' mb={4} padding={15}>
                                        <Flex direction="column" justify="center" p={4}>
                                            <Flex align="flex-start" mb={4}>
                                                <div className={styles.post_top}>
                                                    <div>
                                                        <Avatar src={`http://localhost:3000${user.image_url}`} mr={4}/>
                                                        <div>
                                                            <Text fontWeight='bold'>{post.name}</Text>
                                                        </div>

                                                    </div>
                                                    <div>

                                                    </div>

                                                </div>
                                            </Flex>
                                            @{post.custom_id}
                                            <Image
                                                objectFit='cover'
                                                src={post.image_url}
                                                alt='Post Image'
                                            />
                                            <p className={styles.date}>
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                            <CardBody>
                                                <Text>{post.content}</Text>
                                            </CardBody>
                                            <CardFooter
                                                display='flex'
                                                justifyContent='space-between'
                                                p={4}
                                                className={styles.button}
                                            >
                                                <Button
                                                    variant='ghost'
                                                    colorScheme={post.liked_by_current_user ? "red" : "gray"}
                                                >
                                                    <FavoriteIcon/>
                                                    {post.likes_count}
                                                </Button>
                                                <Button variant='ghost' leftIcon={<BiChat/>}>
                                                    コメント {post.comments.length}件
                                                </Button>
                                                <Button variant='ghost' leftIcon={<BiShare/>}>
                                                    シェア
                                                </Button>
                                            </CardFooter>
                                            <div className={styles.comment_component}>
                                                {post.comments.map((comment: any, index: number) => (
                                                    <div key={index} className={styles.comment}>
                                                        <div className={styles.comment_left}>
                                                            <img className={styles.comment_avatar}
                                                                 src={`http://localhost:3000${comment.avatar}`}
                                                                 alt="avatar"/>
                                                        </div>
                                                        <div className={styles.comment_left}>
                                                            <p>{comment.user_name}</p>
                                                            <p key={index}>{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <AddCommentButton post_id={post.id}/>
                                        </Flex>
                                    </Card>
                                ))}
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    );
}

export default MyProfile;
