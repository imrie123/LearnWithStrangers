import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Login.module.scss';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Input, Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState({
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...',
        custom_id: 'Loading...'
    });

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [customId, setCustomId] = useState('');

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const signUp = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:3000/users', {
                user: { email, password, name, birthday, custom_id: customId }
            });
            localStorage.setItem('token', response.data.token);
            dispatch(setToken(response.data.token));
        } catch (error) {
            console.error("Error axios", error);
        }
    };

    const signIn = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:3000/users/sign_in', {
                user: { email: loginEmail, password: loginPassword }
            });
            localStorage.setItem('token', response.data.auth_token);
            axios.get(`http://127.0.0.1:3000/users/me?token=${response.data.auth_token}`)
                .then((response) => {
                    setUser(response.data.user);
                    navigate(`/`);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            dispatch(setToken(response.data.auth_token));
        } catch (error) {
            console.error("Error axios", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(setToken(token));
        }
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me?token=${token}`)
                .then((response) => {
                    setUser(response.data.user);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, []);

    return (
        <div className={styles.login_page}>
            <div className={styles.formContainer}>
                <Tabs isFitted variant='enclosed'>
                    <TabList mb='1em'>
                        <Tab onClick={toggleForm}>ログイン</Tab>
                        <Tab onClick={toggleForm}>登録</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel className={styles.tab_panel}>
                            <p>Learn With Strangers!</p>
                            <Input type="text" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                            <Input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                            <Button colorScheme='blue' className={styles.button} onClick={signIn}>ログイン</Button>
                        </TabPanel>
                        <TabPanel className={styles.tab_panel}>
                            <p>Learn With Strangers!</p>
                            <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Input type="text" placeholder="Custom id" value={customId} onChange={(e) => setCustomId(e.target.value)} />
                            <Input type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                            <Button colorScheme='blue' className={styles.button} onClick={signUp}>登録</Button>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    );
};

export default Login;
