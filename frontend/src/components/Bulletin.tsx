import React from 'react';
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams, Link} from "react-router-dom";
import {
    Input,
    Button,
    FormControl,
    Avatar,
    Stack,
    StackDivider,
    Card,
    CardBody,
    Heading,
    Box,
    Text
} from "@chakra-ui/react";
import styles from "../styles/Bulletin.module.scss";
import axiosInstance from '../services/axiosInstance.js';

interface Bulletin {
    title: string;
    content: string;
    id: number;
    replies: any[];
    user: {
        name: string;
        avatar: string;
        custom_id: string;
    };
}


function Bulletin() {
    const [bulletin, setBulletin] = useState({
        title: '',
        content: '',
        id: 0,
        replies: [],
        user: {name: '', avatar: '', custom_id: ''}
    });

    const [reply, setReply] = useState('');
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.get(`/bulletin/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    console.log(response.data);
                    setBulletin(response.data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [id]);

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.post(
                `/bulletin/${id}/replies`,
                {
                    content: reply,
                    bulletin_id: id
                },
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
                .then((response) => {
                    console.log(response.data);
                    setReply('');
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }


    return (
        <div className={styles.bulletin}>
            <div className={styles.top}>
                <h1>{bulletin.title}</h1>
                <p>{bulletin.content}</p>
            </div>
            <div className={styles.middle}>
                <Card>
                    <CardBody>
                        <Stack divider={<StackDivider/>} spacing='4'>
                            <ul className={styles.reply_list}>
                                {bulletin.replies.map((reply: any) => (
                                    <li key={reply.id}>
                                        <Link to={`/user/${reply.user?.custom_id}`}>
                                            <Box className={styles.reply_user}>
                                                {reply.user?.avatar ? (
                                                    <Avatar
                                                        src={reply.user.avatar}
                                                        name={reply.user.name}
                                                        className={styles.avatar}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        name={reply.user.name}
                                                        className={styles.avatar}
                                                    />
                                                )}
                                                <div>

                                                    <Heading size='xs' textTransform='uppercase'>
                                                        {reply.user.name}
                                                    </Heading>
                                                    <Text>{reply.content}</Text>
                                                </div>

                                            </Box>
                                        </Link>
                                    </li>
                                ))}

                            </ul>
                        </Stack>
                    </CardBody>
                </Card>
            </div>

            <div className={styles.bottom}>
                <form onSubmit={handleReplySubmit}>
                    <FormControl>
                        <div className={styles.input}>
                            <Input
                                type='text'
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply here..."
                            />
                        </div>
                        <Button type="submit" colorScheme="blue" mt={2}>
                            Reply
                        </Button>
                    </FormControl>
                </form>
            </div>
        </div>
    );
}

export default Bulletin;
