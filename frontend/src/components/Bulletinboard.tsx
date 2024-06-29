import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    useDisclosure,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    FormControl,
    Card,
    CardBody,
    Stack
} from '@chakra-ui/react';
import styles from '../styles/ChatRoom.module.scss';
import style from '../styles/Bulletinboard.module.scss';
import {Link} from "react-router-dom";
import axiosInstance from '../services/axiosInstance.js';
interface Bulletin {
    title: string;
    content: string;
    id: number;

}

function Bulletinboard() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [bulletins, setBulletins] = useState([]);
    const handleBulletinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.post(
                '/bulletin',
                {
                    title: title,
                    content: content
                },
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            ).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.error("Error:", error);
            });
        }
        onClose();
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.get(`/bulletin`, {
                headers: {Authorization: `Bearer ${token}`}
            }).then((response) => {
                console.log(response.data);
                setBulletins(response.data);
            }).catch((error) => {
                console.error("Error:", error);
            });
        }
    }, []);


    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const handleBulletin = () => {
        onOpen();
    }


    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Bulletin Board</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form onSubmit={handleBulletinSubmit}>
                            <FormControl>
                                <div className={styles.input}>
                                    <Input type='text' value={title} onChange={(e) => setTitle(e.target.value)}/>
                                    <Input type='text' value={content} onChange={(e) => setContent(e.target.value)}/>
                                    <Button type='submit'>Submit</Button>
                                </div>
                            </FormControl>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <h1>Bulletinboard</h1>
            <Button onClick={handleBulletin}>Create New</Button>

            <Stack spacing='4' className={style.stack}>
                {bulletins.map((bulletin: Bulletin) => (
                    <Link to={`/bulletin/${bulletin.id}`} key={bulletin.id}>
                        <Card key={bulletin.id}>
                            <CardBody>
                                <h2 className={style.title}>{bulletin.title}</h2>
                                <p className={style.content}>{bulletin.content}</p>
                            </CardBody>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </div>
    );
}

export default Bulletinboard;