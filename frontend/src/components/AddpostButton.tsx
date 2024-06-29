import React, {useRef} from 'react';
import {
    Input,
    Button,
    FormControl,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from '@chakra-ui/react';
import {useState} from 'react';
import axiosInstance from '../services/axiosInstance';

const upload = (formData: FormData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('token is not found');
        return;
    }
    axiosInstance.post(`/posts`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

function InitialFocus() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [inputContent, setInputContent] = useState('');
    const initialRef = useRef<HTMLInputElement | null>(null); // initialRefを追加
    const finalRef = useRef<HTMLInputElement | null>(null); // finalRefを追加


    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput && fileInput.files) {
            formData.append('post[image]', fileInput.files[0]);
            formData.append('post[content]', inputContent);
            upload(formData);
        } else {
            console.error('file input is not found');
        }
        onClose();
    };

    return (
        <>
            <Button onClick={onOpen}>Post</Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Post</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <form>
                            <FormControl>
                                <Input type="file" accept="image/*"/>
                                <Input type="text" value={inputContent} onChange={e => setInputContent(e.target.value)}
                                       ref={initialRef}/>
                            </FormControl>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default InitialFocus;
