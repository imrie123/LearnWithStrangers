import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate, Link} from 'react-router-dom';
import styles from '../styles/Myprofile.module.scss';
import {Card, CardBody, CardFooter, Flex, Text, Button, Image, Avatar} from '@chakra-ui/react';
import {BiShare} from 'react-icons/bi';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentButton from './AddCommentButton';
import style from '../styles/OtherUserProfile.module.scss';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter
} from '@chakra-ui/react';
import {useDisclosure} from '@chakra-ui/hooks';
import axiosInstance from '../services/axiosInstance.js';
interface Post {
    id: number;
    custom_id: string;
    content: string;
    image_url?: string;
    created_at: string;
    post_id: number;
    user_id: number;
    likes_count: number;
    liked_by_current_user: boolean;
    liked_by_current_user_id: number;
    comments: string[];
    contents: string[];
    following_count: number;
    follower_count: number;
    post_count: number;
    following_users: [];
    liked_data: {
        liked_id: number;
        user_name: string;
        avatar: string;
    }[];

}

const OtherUserProfile = () => {
    const {custom_id} = useParams<{ custom_id: string }>();
    const navigate = useNavigate();
    const {onClose} = useDisclosure()


    const [user, setUser] = useState({
        id: 0,
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...',
        custom_id: 'Loading...',
        user_id: null,
        followed_by_current_user: false,
        following_count: 0,
        follower_count: 0,
        post_count: 0,
        following_users: [],
        followers: [],
    });

    const [posts, setPosts] = useState<Post[]>([]);
    const [postLikes, setPostLikes] = useState<{ [post_id: number]: number }>({});
    const [likeData, setLikeData] = useState<{ post_id?: number | null, id?: number | null } | null>({
        post_id: null,
        id: null
    });
    const {isOpen: isOpenFollowing, onOpen: onOpenFollowing, onClose: onCloseFollowing} = useDisclosure();
    const {isOpen: isOpenFollower, onOpen: onOpenFollower, onClose: onCloseFollower} = useDisclosure();

    const [currentUser, setCurrentUser] = useState({
        id: 0,
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        axiosInstance.get(`/users/${custom_id}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((response) => {
                setUser(response.data.user);
                setPosts(response.data.user.posts);
                setLikeData(response.data.user.posts.map((post: Post) => post.liked_data));
                console.log(response.data.user.posts.map((post: Post) => post.liked_data));
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [custom_id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.get(`/users/me`, {
                headers: {Authorization: `Bearer ${token}`},
            })
                .then((response) => {
                    console.log(response.data);
                    setCurrentUser(response.data.user);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, []);

    const handleStartChat = () => {
        const token = localStorage.getItem('token');
        axiosInstance.post(`/users/${custom_id}/rooms`, {
            room: {
                name: user.name,
                current_user_custom_id: currentUser.id,
                other_user_custom_id: user.id, // ここで user の id を正しく取得する
            }
        }, {
            headers: {Authorization: `Bearer ${token}`}
        }).then((response) => {
            console.log(response.data);
            navigate(`/room/${response.data.id}`);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    const handleFollow = () => {
        const token = localStorage.getItem('token');
        axiosInstance.post(
            `/users/${custom_id}/relationships`,
            {},
            {headers: {Authorization: `Bearer ${token}`}}
        )
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
        axiosInstance.delete(`/users/${custom_id}/relationships`, {
            headers: {Authorization: `Bearer ${token}`},
        })
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
        const post = posts.find((post) => post.post_id === post_id);
        if (!token || !post || !post.id) {
            console.error('Token is missing or post not found or invalid post ID');
            return;
        }

        axiosInstance.post(`/users/${post.custom_id}/posts/${post.id}/likes`, {}, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((response) => {
                console.log(response.data.id);
                setLikeData(response.data.id);
                const likedPostIndex = posts.findIndex((post: Post) => post.post_id === post_id);
                posts[likedPostIndex].liked_by_current_user = true;
                setPosts([...posts]);
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
        const post = posts.find((post) => post.post_id === post_id);
        if (!token || !post) {
            console.error('Token is missing or post not found');
            return;
        }

        axiosInstance.delete(`/users/${post.custom_id}/posts/${post.id}/likes/${likeData}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(() => {
                const unlikedPostIndex = posts.findIndex((post: Post) => post.post_id === post_id);
                posts[unlikedPostIndex].liked_by_current_user = false;
                setPosts([...posts]);
                setPostLikes(prevPostLikes => ({
                    ...prevPostLikes,
                    [post_id]: Math.max((prevPostLikes[post_id] || 0) - 1, 0)
                }));
            })
            .catch((error) => {
                console.error('Error in unlike:', error);
            });
    };


    return (
        <div className={styles.myprofile}>
            <Modal isOpen={isOpenFollowing} onClose={onCloseFollowing}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton/>
                    {/*<ModalBody>*/}
                    {/*    {user.following_users.map((user: any) => (*/}
                    {/*        <div key={user.id} className={styles2.following_user}>*/}

                    {/*            <div key={user.custom_id} className={styles2.group_member}>*/}
                    {/*                <div>*/}
                    {/*                    {user.avatar_url ? (*/}
                    {/*                        <img className={styles.avatar}*/}
                    {/*                             src={`http://localhost:3000${user.avatar_url}`}*/}
                    {/*                             alt="avatar"/>*/}
                    {/*                    ) : (*/}
                    {/*                        <Avatar name={user.name}/>*/}
                    {/*                    )}*/}


                    {/*                </div>*/}

                    {/*                <div><p>{user.name}</p></div>*/}


                    {/*            </div>*/}

                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</ModalBody>*/}

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenFollower} onClose={onCloseFollower}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>フォロー</ModalHeader>
                    <ModalCloseButton/>
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
                        {user.avatar_url ? (
                            <img className={styles.avatar} src={`https://api.learnwithstranger.com${user.avatar_url}`}
                                 alt="avatar"/>
                        ) : (
                            <Avatar name={user.name} style={{width: '200px', height: '200px'}}/>
                        )}


                        <div className={styles.info}>
                            <div className={styles.follow}>
                                <p onClick={onOpenFollowing}>Following: {user.following_count}</p>
                                <p onClick={onOpenFollower}>Followers: {user.follower_count}</p>
                                <p>Posts: {user.post_count}</p>
                                <Button onClick={handleStartChat}>Send Message</Button>
                            </div>
                            <div className={styles.user}>
                                <p>{user.name}</p>
                                <p>@{user.custom_id}</p>
                                <p>Spoken Language: {user.spoken_language}</p>
                                <p>Learning Language: {user.learning_language}</p>
                                <p>Residence: {user.residence}</p>
                                <p>Introduction: {user.introduction}</p>
                                <Button onClick={user.followed_by_current_user ? handleUnFollow : handleFollow}
                                        colorScheme={user.followed_by_current_user ? "gray" : "blue"}>
                                    {user.followed_by_current_user ? "Unfollow" : "Follow"}
                                </Button>
                            </div>


                            <div className={styles.user_posts}>
                                {posts.length > 0 && (
                                    <div className={styles.user_posts}>
                                        {posts.map(post => (
                                            <Card key={post.id} maxW='4xl' mb={4} padding={15}>
                                                <Flex direction="column" justify="center" p={10}>
                                                    <Flex align="flex-start" mb={5}>

                                                        {user.avatar_url ? (
                                                            <img className={style.avatar}
                                                                 src={`https://api.learnwithstranger.com${user.avatar_url}`}
                                                                 alt="avatar"/>
                                                        ) : (
                                                            <Avatar name={user.name}/>
                                                        )}
                                                        <div>
                                                            <Text fontWeight='bold'>{user.name}</Text>
                                                            @{user.custom_id}
                                                        </div>

                                                    </Flex>
                                                    <div className={style.post_image_comments}>
                                                        <Image objectFit='cover' src={post.image_url} alt='Post Image'/>

                                                    </div>

                                                    <CardBody>
                                                        <Text>{post.content}</Text>
                                                    </CardBody>
                                                    <div className={style.footer}>
                                                        <Button
                                                            variant='ghost'
                                                            colorScheme={post.liked_by_current_user ? "red" : "gray"} // レスポンスに基づいて色を設定
                                                            onClick={() => post.liked_by_current_user ? handleUnlike(post.post_id) : handleLike(post.post_id)} // レスポンスに基づいて処理を実行
                                                        >
                                                            <FavoriteIcon/>
                                                            {postLikes[post.post_id] ?? post.likes_count}
                                                        </Button>

                                                        <div className={style.comment_button}>
                                                            <QuestionAnswerOutlinedIcon/>{post.comments.length}Comments
                                                        </div>
                                                    </div>
                                                    <CardFooter p={3} className={style.footer_component}>
                                                        <div className={style.comment_component}>
                                                            {post.comments.map((comment: any, index: number) => (
                                                                <div key={index} className={style.comment}>
                                                                    <div className={style.comment_left}>
                                                                        <img className={style.avatar}
                                                                             src={`${comment.avatar}`}
                                                                             alt="avatar"/>
                                                                    </div>
                                                                    <div className={style.comment_right}>
                                                                        <p>{comment.user_name}</p>
                                                                        <p key={index}>{comment.content}</p>
                                                                    </div>

                                                                </div>

                                                            ))}
                                                        </div>
                                                    </CardFooter>
                                                </Flex>
                                                <AddCommentButton post_id={post.id}/>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default OtherUserProfile;
