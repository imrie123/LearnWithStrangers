import {useEffect, useState} from 'react'
import axios from 'axios'
import {Button} from '@chakra-ui/button'
import {Image} from '@chakra-ui/image'
import {Flex} from '@chakra-ui/layout'
import {Text} from '@chakra-ui/layout'
import {Card, CardBody, CardFooter, Avatar} from '@chakra-ui/react';
import {BiChat, BiShare} from 'react-icons/bi';
import styles from '../styles/Findpost.module.scss';
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
    avatar_url: string;
    name: string;
    custom_id: string;

}

interface likedPosts {
    custom_id: string;
    post_id: number;
    id: number;

}

function Findpost() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postLikes, setPostLikes] = useState<{ [post_id: number]: number }>({});
    const [id, setId] = useState<number | null>();
    const [likedPosts, setLikedPosts] = useState<likedPosts>();
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
    useEffect(() => {
            const token = localStorage.getItem('token');
            axios.get(`http://127.0.0.1:3000/likes/liked_posts`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    console.log(response.data);
                    setLikedPosts(response.data);
                    console.log(likedPosts);

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        , []);
    const handleLike = (post_id: number) => {
        console.log("Post ID:", post_id);
        const token = localStorage.getItem('token');
        const post = posts.find((post) => post.post_id === post_id);
        console.log('Post ID:', post_id); // post_idの値を確認
        console.log('Post:', post); // 投稿オブジェクトを確認
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
        const post = posts.find((post) => post.post_id === post_id);
        if (!token || !post) {
            console.error('Token is missing or post not found');
            return;
        }

        axios.delete(`http://127.0.0.1:3000/users/${post.custom_id}/posts/${post.id}/likes/${likeData}`, { // いいねのIDを指定
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(() => {
                const unlikedPostIndex = posts.findIndex((post: Post) => post.post_id === post_id);
                posts[unlikedPostIndex].liked_by_current_user = false;
                setPosts([...posts]); // 投稿のいいね関連のステートを更新
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
                            <Card key={post.id} maxW='2xl' mb={4}>
                                <Flex direction="column" align="center" justify="center" p={4}>
                                    <Flex align="flex-start" mb={4}>
                                        <Avatar src={`http://localhost:3000${post.avatar_url}`} mr={4}/>
                                        <Text fontWeight='bold'>{post.name}</Text>
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
                )}
            </div>
        </div>

    )
}

export default Findpost