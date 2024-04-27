import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import styles from '../styles/Myprofile.module.scss';
import {Card, CardBody, CardFooter, Flex, Text, Button, Image, Avatar} from '@chakra-ui/react';
import {BiShare} from 'react-icons/bi';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentButton from './AddCommentButton';
import style from '../styles/OtherUserProfile.module.scss';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

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
    comments: string[];
    contents: string[];


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
    const navigate = useNavigate();
    const [likeData, setLikeData] = useState<{ post_id?: number | null } | null>(null);
    const [comment, setComment] = useState('');

    const handleStartChat = () => {
        const token = localStorage.getItem('token');
        axios.post(`http://127.0.0.1:3000/users/${custom_id}/room`, {}, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then((response) => {
                console.log(response.data);
                navigate(`/${custom_id}/${response.data.id}/${response.data.name}`);

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    const handleFollow = () => {
        const token = localStorage.getItem('token');

        axios.post(
            `http://127.0.0.1:3000/users/${custom_id}/relationships`,
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

        axios.delete(`http://127.0.0.1:3000/users/${custom_id}/relationships`, {
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
        if (!token) {
            console.error('Token is missing');
            return;
        }

        axios.post(`http://127.0.0.1:3000/users/${custom_id}/posts/${id}/likes`, {}, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((response) => {
                const likedPostIndex = posts.findIndex((post: Post) => post.post_id === post_id);
                posts[likedPostIndex].liked_by_current_user = true;
                setPosts(() => posts);
                setLikeData(response.data);
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
        if (!likeData || !likeData.post_id) {
            console.error('likeData or post_id is missing');
            return;
        }

        const post = posts.find(post => post.post_id === post_id);
        if (!post) {
            console.error('Post not found');
            return;
        }

        axios.delete(`http://127.0.0.1:3000/users/${custom_id}/posts/${likeData.post_id}/likes/${id}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
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
        axios.get(`http://127.0.0.1:3000/users/${custom_id}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((response) => {
                setUser(response.data.user);
                setPosts(response.data.user.posts);
                setId(response.data.user.posts[0].id);
                console.log(response.data.user);
                setComment(response.data.posts.comments)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [custom_id]);

    const handleAddComment = () => {

    }

    return (
        <div className={styles.myprofile}>
            <div className={styles.component}>
                <div className={styles.top}>
                    <div className={styles.introduce}>
                        <img className={styles.avatar} src={`http://localhost:3000${user.avatar_url}`}
                             alt="avatar"/>
                        <div className={styles.info}>
                            <div className={styles.follow}>
                                <p>フォロー:100</p>
                                <p>フォロワー:100</p>
                                <p>投稿:100</p>
                                <Button onClick={handleStartChat}>メッセージを送信する</Button>
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
                                {posts.length > 0 && (
                                    <div className={styles.user_posts}>
                                        {posts.map(post => (
                                            <Card key={post.id} maxW='4xl' mb={4} padding={15}>
                                                <Flex direction="column" justify="center" p={10}>
                                                    <Flex align="flex-start" mb={5}>
                                                        <Avatar src={`http://localhost:3000${user.avatar_url}`}
                                                                mr={4} className={style.avatar}/>
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

                                                        <div className={style.comment_button}><QuestionAnswerOutlinedIcon/>コメント{post.comments.length}件</div>

                                                        <Button variant='ghost'
                                                                leftIcon={<BiShare/>}>シェア</Button>
                                                    </div>
                                                    <CardFooter p={3} className={style.footer_component}>

                                                        <div className={style.comment_component}>
                                                            {post.comments.map((comment: any, index: number) => (
                                                                <div key={index} className={style.comment}>
                                                                    <div className={style.comment_left}>
                                                                        <img className={style.avatar}
                                                                             src={`http://localhost:3000${comment.avatar}`}
                                                                             alt="avatar"/>
                                                                    </div>
                                                                    <div className={style.comment_left}>
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
