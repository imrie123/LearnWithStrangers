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
import EditIcon from '@mui/icons-material/Edit';
import styles from '../styles/Myprofile.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddpostButton from './AddpostButton';
import AddCommentButton from './AddCommentButton';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'
import styles2 from '../styles/GroupChat.module.scss';
import {FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton} from 'react-share';
import {BiChat, BiShare} from 'react-icons/bi';


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
    comments: any[];
    custom_id: string;
    following_user_posts: any[];
    user_posts: any[];
    liked_posts: any[];
    following_count: number;
    follower_count: number;
    post_count: number;


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
        following_count: 0,
        follower_count: 0,
        post_count: 0,
        following_users: [],
        follower_users: [],
        followers: [],
    });
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const {isOpen: isOpenFollowing, onOpen: onOpenFollowing, onClose: onCloseFollowing} = useDisclosure();
    const {isOpen: isOpenFollower, onOpen: onOpenFollower, onClose: onCloseFollower} = useDisclosure();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(`http://127.0.0.1:3000/users/me`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    setUser(response.data.user);
                    setPosts(response.data.user.user_posts);
                    setLikedPosts(response.data.user.liked_posts);
                    console.log(response.data.user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
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
            <Modal isOpen={isOpenFollowing} onClose={onCloseFollowing}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Following</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {user.following_users.map((user: any) => (
                            <Link to={`/user/${user.custom_id}`}>
                                <div key={user.id} className={styles2.following_user}>

                                    <div key={user.custom_id} className={styles2.group_member}>
                                        <div><Avatar name={user.name} src={`http://localhost:3000${user.avatar_url}`}/>
                                        </div>

                                        <div><p>{user.name}</p></div>


                                    </div>

                                </div>
                            </Link>
                        ))}


                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onCloseFollowing}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenFollower} onClose={onCloseFollower}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Followers</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {user.followers.map((user: any) => (
                            <Link to={`/user/${user.custom_id}`}>
                                <div key={user.id} className={styles2.following_user}>

                                    <div key={user.custom_id} className={styles2.group_member}>
                                        <div><Avatar name={user.name} src={`http://localhost:3000${user.avatar_url}`}/>
                                        </div>

                                        <div><p>{user.name}</p></div>


                                    </div>

                                </div>
                            </Link>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onCloseFollower}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className={styles.component}>
                <div className={styles.top}>
                    <div className={styles.introduce}>
                        <img className={styles.avatar} src={`http://localhost:3000${user.avatar_url}`} alt="avatar"/>
                        <div className={styles.info}>
                            <div className={styles.follow}>
                                <p onClick={onOpenFollowing}>Following:{user.following_count}</p>
                                <p onClick={onOpenFollower}>Followers:{user.follower_count}</p>
                                <p>Posts:{user.post_count}</p>
                                <Link to="/setting">
                                    <SettingsIcon/>
                                </Link>
                            </div>
                            <div className={styles.myprofile_footer}>
                                <div className={styles.user}>
                                    <p>{user.name}</p>
                                    <p>@{user.custom_id}</p>
                                    <p>Spoken Language:{user.spoken_language}</p>
                                    <p>Learning Language:{user.learning_language}</p>
                                    <p>Residence:{user.residence}</p>
                                    <p>Introduction:{user.introduction}</p>
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
                        <Tab>Post</Tab>
                        <Tab>Liked Posts</Tab>
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
                                                    className={styles.comment_button}>{post.comments.length}Comments
                                                </div>
                                                <FacebookShareButton url={`http://localhost:3001/share/${post.id}`}>
                                                    <FacebookIcon size={32} round={true}/>
                                                </FacebookShareButton>
                                                <TwitterShareButton url={`http://localhost:3001/share/${post.id}`}>
                                                    <TwitterIcon size={32} round={true}/>
                                                </TwitterShareButton>
                                                <Link to={`/editpost/${post.post_id}`}>
                                                    <EditIcon/>
                                                </Link>
                                                <Button onClick={() => deletePost(post.post_id)}>
                                                    Delete
                                                </Button>
                                            </CardFooter>
                                            <div className={styles.comment_component}>
                                                {post.comments.map((comment: any, index: number) => (
                                                    <div key={index} className={styles.comment}>
                                                        <div className={styles.comment_left}>
                                                            <Link to={`/user/${post.custom_id}`}>
                                                                <img className={styles.comment_avatar}
                                                                     src={`http://localhost:3000${comment.avatar_url}`}
                                                                     alt="avatar"/>
                                                            </Link>
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
                                                        <Link to={`/user/${post.custom_id}`}>
                                                            {post.avatar_url ? (
                                                                <img className={styles.liked_post_avatar}
                                                                     src={`http://localhost:3000${post.avatar_url}`}
                                                                     alt="avatar"/>
                                                            ) : (
                                                                <Avatar name={post.name}/>
                                                            )}
                                                        </Link>
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
                                                <Text className={styles.content}>{post.content}</Text>
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
                                                    {post.comments.length}Comments
                                                </Button>
                                                <Button variant='ghost' leftIcon={<BiShare/>}>
                                                    Share
                                                </Button>
                                            </CardFooter>
                                            <div className={styles.comment_component}>
                                                {post.comments.map((comment: any, index: number) => (
                                                    <div key={index} className={styles.comment}>
                                                        <div className={styles.comment_left}>
                                                            <Link to={`/user/${comment.custom_id}`}>
                                                                {comment.avatar_url ? (
                                                                    <img className={styles.liked_post_avatar}
                                                                         src={`http://localhost:3000${comment.avatar_url}`}
                                                                         alt="avatar"/>
                                                                ) : (
                                                                    <Avatar name={post.name}/>
                                                                )}

                                                            </Link>
                                                        </div>
                                                        <div className={styles.comment_right}>
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
