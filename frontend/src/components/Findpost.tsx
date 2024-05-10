import {useEffect, useState} from 'react';
import axios from 'axios';
import {Button} from '@chakra-ui/button';
import {Image} from '@chakra-ui/image';
import {Flex} from '@chakra-ui/layout';
import {Text} from '@chakra-ui/layout';
import {Card, CardBody, CardFooter, Avatar} from '@chakra-ui/react';
import {BiShare} from 'react-icons/bi';
import styles from '../styles/Findpost.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentButton from './AddCommentButton';

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
    avatar_url: string;
    name: string;
    custom_id: string;
    comments: string[];
}


function Findpost() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postLikes, setPostLikes] = useState<{ [post_id: number]: number }>({});
    const [likeData, setLikeData] = useState<{ post_id?: number | null } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://127.0.0.1:3000/users/me`, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then((response) => {
                console.log(response.data);
                setPosts(response.data.user.following_user_posts);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);


    const handleLike = (post_id: number) => {
        console.log("Post ID:", post_id);
        const token = localStorage.getItem('token');
        const post = posts.find((post) => post.post_id === post_id);
        console.log('Post ID:', post_id);
        console.log('Post:', post);
        if (!token || !post || !post.id) {
            console.error('Token is missing or post not found or invalid post ID');
            return;
        }

        axios.post(`http://127.0.0.1:3000/users/${post.custom_id}/posts/${post.id}/likes`, {}, {
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

        axios.delete(`http://127.0.0.1:3000/users/${post.custom_id}/posts/${post.id}/likes/${likeData}`, {
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
        <div className={styles.container}>
            <div className={styles.posts}>
                {posts.length > 0 && (
                    <div className={styles.user_posts}>
                        {posts.map(post => (
                            <Card key={post.id} maxW='4xl' mb={4} padding={15}>
                                <Flex direction="column" justify="center" p={10}>
                                    <Flex align="flex-start" mb={4}>
                                        <div className={styles.post_top}>
                                            <Avatar src={`http://localhost:3000${post.avatar_url}`} mr={4}/>
                                            <div>
                                                <Text fontWeight='bold'>{post.name}</Text>
                                                {post.custom_id}
                                            </div>
                                        </div>
                                    </Flex>
                                    <Image objectFit='cover' src={post.image_url} alt='Post Image'/>
                                    <p className={styles.date}>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                    <CardBody>
                                        <Text>{post.content}</Text>
                                    </CardBody>
                                    <CardFooter display='flex' justifyContent='space-between' p={4}>
                                        <div className={styles.footer}>
                                            <div className={styles.button}>
                                                <Button
                                                    variant='ghost'
                                                    colorScheme={post.liked_by_current_user ? "red" : "gray"}
                                                    onClick={() => post.liked_by_current_user ? handleUnlike(post.post_id) : handleLike(post.post_id)}
                                                >
                                                    <FavoriteIcon/>
                                                    {postLikes[post.post_id] ?? post.likes_count}
                                                </Button>
                                                <div
                                                    className={styles.comment_button}>コメント{post.comments.length}件
                                                </div>

                                                <Button variant='ghost' leftIcon={<BiShare/>}>シェア</Button>
                                            </div>
                                        </div>


                                    </CardFooter>
                                    <div className={styles.comment_component}>
                                        {post.comments.map((comment: any, index: number) => (
                                            <div key={post.id} className={styles.comment}>
                                                <div className={styles.comment_left}>
                                                    <img className={styles.comment_avatar}
                                                         src={`http://localhost:3000${comment.avatar}`}
                                                         alt="avatar"/>
                                                </div>
                                                <div className={styles.comment_left}>
                                                    <p>{comment.user_name}</p>
                                                    <p>{comment.created_at}</p>
                                                    <p key={index}>{comment.content}</p>
                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                    <AddCommentButton post_id={post.post_id}/>
                                </Flex>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Findpost;
