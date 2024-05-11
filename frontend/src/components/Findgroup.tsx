import React, {useEffect, useState, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {Checkbox, CheckboxGroup} from '@chakra-ui/react';
import axios from 'axios';
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
import {Card, CardHeader, CardBody, CardFooter} from '@chakra-ui/react'
import {Heading, Stack, Text} from '@chakra-ui/layout'
import {Avatar, AvatarGroup} from '@chakra-ui/react'

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
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [chatGroups, setChatGroups] = useState([]);
    const [introduction, setIntroduction] = useState('');
    const [currentUserCustomId, setCurrentUserCustomId] = useState('');

    const handleSelect = (id: string) => {
        const isSelected = selectedUsers.includes(id);

        if (isSelected) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    }

    const handleSave = () => {
        console.log("Selected users:", selectedUsers);
        axios.post(`http://127.0.0.1:3000/groups`, {
            name: groupName,
            introduction: introduction,
            users: [...selectedUsers, currentUserCustomId]
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
            axios.get(`http://127.0.0.1:3000/users/me`, {
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
            axios.get(`http://127.0.0.1:3000/groups`, {
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
                        <CheckboxGroup value={selectedUsers}>
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
            </Modal><Stack spacing='4'>
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