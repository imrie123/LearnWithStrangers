
import React from "react";
import axios from "axios";
import { useEffect,useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Findgroup from "./Findgroup";
import { Card, CardHeader, CardBody, CardFooter,Stack,Heading } from '@chakra-ui/react'
import styles from '../styles/Findgroup.module.scss';
import { Link } from "react-router-dom";

interface Room {
    id: number;
    name: string;
    last_message: string;

}

function Message() {
  const [user, setUser] = useState(null);
  const [customId, setCustomId] = useState();
    const [userRooms, setUserRooms] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`http://127.0.0.1:3000/users/me`, {
        headers: {Authorization: `Bearer ${token}`}
      })
          .then((response) => {
            setUser(response.data.user);
            console.log(response.data.user);
            setUserRooms(response.data.user.user_rooms);
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
    }
  }, []);


  return (
      <div>
        <Tabs isFitted variant='enclosed'>
          <TabList mb='1em'>
            <Tab>チャット</Tab>
            <Tab>グループチャット</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
                <Stack spacing='4' className={styles.chat_group}>
                    {userRooms.map((room: Room) => (
                        <Card key={room.id}>
                            <CardHeader>
                                <Link to={`/rooms/${room.id}`}>
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