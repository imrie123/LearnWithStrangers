import React, {useRef, useState, useEffect} from 'react';
import axios from 'axios';
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
import MessageIcon from '@mui/icons-material/Message';
import styles from '../styles/AddCommentButton.module.scss';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
interface AddCommentButtonProps {
    post_id: number;

}
function AddCommentButton(props: AddCommentButtonProps) {
    console.log(props);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [inputContent, setInputContent] = useState('');
    const initialRef = useRef<HTMLInputElement | null>(null); // initialRefを追加
    const finalRef = useRef<HTMLInputElement | null>(null); // finalRefを追加
    const {post_id} = props;
    const handleSave = () => {
        const token = localStorage.getItem('token')
        axios.post(`http://127.0.0.1:3000/posts/${props.post_id}/comments`, {
            post_id: post_id,
            content: inputContent
        }, {
            headers: {Authorization: `Bearer ${token}`},
            responseType: 'json'
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return (
        <>
            <div onClick={onOpen} className={styles.Button}>
                <QuestionAnswerOutlinedIcon/>
                コメント
            </div>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>投稿</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <form>
                            <FormControl>

                                <Input type="text" value={inputContent} onChange={e => setInputContent(e.target.value)}
                                       ref={initialRef}/>
                            </FormControl>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3}　onClick={handleSave}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddCommentButton;