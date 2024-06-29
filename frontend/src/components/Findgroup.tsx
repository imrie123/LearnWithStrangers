import React, {useEffect, useState, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {Checkbox, CheckboxGroup} from '@chakra-ui/react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    FormControl,
    Button
} from '@chakra-ui/react';
import {useDisclosure} from '@chakra-ui/hooks';
import {Link} from 'react-router-dom';
import {Card, CardHeader, CardBody} from '@chakra-ui/react'
import {Heading, Stack} from '@chakra-ui/layout'
import styles from '../styles/Findgroup.module.scss';
import axiosInstance from '../services/axiosInstance';

interface FollowingUser {
    name: string;
    custom_id: string;
}

function FollowingUserSelect({name, custom_id, handleSelect}: FollowingUser & {
    handleSelect: (custom_id: string) => void
}) {
    return (
        <FormControl key={custom_id} mt={4}>
            <Checkbox value={custom_id} onChange={() => handleSelect(custom_id)}>{name}</Checkbox>
        </FormControl>
    );
}

function Findgroup() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [groupName, setGroupName] = useState('');
    const [chatGroups, setChatGroups] = useState([]);
    const [introduction, setIntroduction] = useState('');
    const [currentUserCustomId, setCurrentUserCustomId] = useState('');

    const handleSelect = (id: string) => {
        if (selectedUsers.has(id)) {
            setSelectedUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            })
        } else {
            selectedUsers.add(id);
        }
        setSelectedUsers(new Set(selectedUsers));
    }

    const handleSave = () => {
        console.log("Selected users:", Array.from(selectedUsers));
        axiosInstance.post(`/groups`, {
            name: groupName,
            introduction: introduction,
            users: [...Array.from(selectedUsers), currentUserCustomId]
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                console.log(response.data);
                onClose();
            })
            .catch((error) => {
                console.error("Error creating group:", error);
            });
    }


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.get(`/users/me`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    setFollowingUsers(response.data.user.following_users);
                    setCurrentUserCustomId(response.data.user.custom_id);
                })
                .catch((error) => {
                    console.error("Error fetching posts:", error);
                });
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.get(`/groups`, {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then((response) => {
                    setChatGroups(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching groups:", error);
                });
        }
    }, []);

    return (
        <div>
            <FontAwesomeIcon icon={faCirclePlus} size="2xl" onClick={onOpen}/>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Select Users</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <Input placeholder="group name" value={groupName} onChange={(e) => setGroupName(e.target.value)}
                               ref={initialRef}/>
                        <Input placeholder="introduce" value={introduction}
                               onChange={(e) => setIntroduction(e.target.value)} ref={initialRef}/>
                        <CheckboxGroup value={Array.from(selectedUsers)}>
                            {followingUsers.map((user: FollowingUser) => (
                                <FollowingUserSelect key={user.custom_id} custom_id={user.custom_id} name={user.name}
                                                     handleSelect={handleSelect}/>
                            ))}
                        </CheckboxGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSave}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Stack spacing='4' className={styles.chat_group}>
                {chatGroups.map((group: any) => (
                    <Card key={group.id}>
                        <Link to={`/group/${group.id}`}>
                            <CardHeader>
                                <Heading size='md'>
                                    {group.name}
                                </Heading>
                            </CardHeader>
                            <CardBody>
                            </CardBody>
                        </Link>
                    </Card>
                ))}
            </Stack>

        </div>
    );
}

export default Findgroup;