import {useEffect, useState} from 'react';
import axios from 'axios';
import {Button} from '@chakra-ui/button';
import {Image} from '@chakra-ui/image';
import {Flex} from '@chakra-ui/layout';
import {Text} from '@chakra-ui/layout';
import {Card, CardBody, CardFooter, Avatar} from '@chakra-ui/react';
import styles from '../styles/Findpost.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentButton from './AddCommentButton';
import {Link} from 'react-router-dom';
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
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`http://127.0.0.1:3000/users/me`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    setPosts(response.data.user.following_user_posts);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchPosts();
    }, []);


    const handleLikeToggle = async (post_id: number) => {
        const token = localStorage.getItem('token');
        const post = posts.find((post) => post.post_id === post_id);
        if (!token || !post || !post.id) {
            console.error('Token is missing or post not found or invalid post ID');
            return;
        }

        try {
            let response;
            if (post.liked_by_current_user) {
                response = await axios.delete(`http://127.0.0.1:3000/users/${post.custom_id}/posts/${post.id}/likes/${likeData}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
            } else {
                response = await axios.post(`http://127.0.0.1:3000/users/${post.custom_id}/posts/${post.id}/likes`, {}, {
                    headers: {Authorization: `Bearer ${token}`},
                });
            }

            const likedPostIndex = posts.findIndex((post: Post) => post.post_id === post_id);
            posts[likedPostIndex].liked_by_current_user = !post.liked_by_current_user;
            setPosts([...posts]);
            setPostLikes(prevPostLikes => ({
                ...prevPostLikes,
                [post_id]: post.liked_by_current_user ? (prevPostLikes[post_id] || 0) + 1 : Math.max((prevPostLikes[post_id] || 0) - 1, 0)
            }));
        } catch (error) {
            console.error('Error:', error);
        }
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
                                            <Link to={`/user/${post.custom_id}`}>
                                                {post.avatar_url ? (
                                                    <img className={styles.avatar}
                                                         src={`http://localhost:3000${post.avatar_url}`}
                                                         alt="avatar"/>
                                                ) : (
                                                    <Avatar name={post.name}/>
                                                )}
                                            </Link>
                                            <div>
                                                <Text fontWeight='bold'>{post.name}</Text>
                                                @{post.custom_id}
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
                                                    onClick={() => handleLikeToggle(post.post_id)}
                                                >
                                                    <FavoriteIcon/>
                                                    {postLikes[post.post_id] ?? post.likes_count}
                                                </Button>
                                                <div
                                                    className={styles.comment_button}>{post.comments.length}Comments
                                                </div>
                                            </div>
                                        </div>


                                    </CardFooter>
                                    <div className={styles.comment_component}>
                                        {post.comments.map((comment: any, index: number) => (
                                            <div key={post.id} className={styles.comment}>
                                                <div className={styles.comment_left}>
                                                    <Link to={`/user/${comment.custom_id}`}>
                                                        {comment.avatar ? (
                                                            <img className={styles.avatar} src={`${comment.avatar}`}
                                                                 alt="avatar"/>
                                                        ) : (
                                                            <Avatar name={comment.name}/>
                                                        )}
                                                    </Link>
                                                </div>

                                                <div className={styles.comment_right}>
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
