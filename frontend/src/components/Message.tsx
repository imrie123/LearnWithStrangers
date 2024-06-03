import React from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import {Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import Findgroup from "./Findgroup";
import {Card, CardHeader, CardBody, Stack, Heading} from '@chakra-ui/react'
import styles from '../styles/Findgroup.module.scss';
import {Link} from "react-router-dom";

interface Room {
    id: number;
    name: string;
    last_message: string;
}

function Message() {
    const [userRooms, setUserRooms] = useState<Room[]>([]);


    useEffect(() => {
        const fetchUserRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(`http://127.0.0.1:3000/users/me`, {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    setUserRooms(response.data.user.user_rooms);
                }
            } catch (error) {
                console.error("Error fetching user rooms:", error);
            }
        };

        fetchUserRooms();
    }, []);


    return (
        <div>
            <Tabs isFitted variant='enclosed'>
                <TabList mb='1em'>
                    <Tab>Chat</Tab>
                    <Tab>Group Chat</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Stack spacing='4' className={styles.chat_group}>
                            {userRooms.map((room: Room) => (
                                <Card key={room.id}>
                                    <CardHeader>
                                        <Link to={`/room/${room.id}`}>
                                            <Heading size='md'>
                                                {room.name}
                                            </Heading>
                                        </Link>
                                    </CardHeader>
                                    <CardBody>
                                    </CardBody>
                                </Card>
                            ))}
                        </Stack>
                    </TabPanel>
                    <TabPanel>
                        <Findgroup/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default Message;