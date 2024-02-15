import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from '../styles/Login.module.scss';
import {Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import {Input} from "@chakra-ui/react"
import {Button} from "@chakra-ui/react"
import {useDispatch} from "react-redux";
import {setToken} from "../redux/authSlice";
import {useNavigate} from "react-router-dom"


const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin(!isLogin);
    }
    const signUp = async (email: string, password: string, name: string, birthday: string) => {
        try {

            const response = await axios.post('http://127.0.0.1:3000/users', {
                withCredentials: true,
                user:
                    {
                        email: email,
                        password: password,
                        name: name,
                        birthday: birthday,
                    }
            });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            dispatch(setToken(response.data.token));

            // 成功したらページをリダイレクトする。
        } catch (error) {

            console.error("Error axios", error);
        }
    };
    const signIn = async (email: string, password: string) => {
        try {

            const response = await axios.post('http://127.0.0.1:3000/users/sign_in', {
                withCredentials: true,
                user: {
                    email: email,
                    password: password,
                }
            });
            console.log(response.data);
            localStorage.setItem('token', response.data.auth_token)
            dispatch(setToken(response.data.auth_token));
            return response.data;
        } catch (error) {

            console.error("Error axios", error);

        }
    }
    useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                dispatch(setToken(token));
            }
        }
        , [dispatch]);


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
                            <div className={styles.Input}>

                                <Input type="text" placeholder="Email" onChange={(e) => setLoginEmail(e.target.value)}/>

                            </div>
                            <div className={styles.Input}>
                                <Input type="password" placeholder="Password"
                                       onChange={(e) => setLoginPassword(e.target.value)}/>
                            </div>


                            <Button colorScheme='blue' className={styles.button}
                                    onClick={() => signIn(loginEmail, loginPassword)}>ログイン</Button>
                        </TabPanel>
                        <TabPanel className={styles.tab_panel}>
                            <p>Learn With Strangers!</p>
                            <div className={styles.Input}>

                                <Input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>

                            </div>
                            <div className={styles.Input}>
                                <Input type="password" placeholder="Password"
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className={styles.Input}>
                                <Input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className={styles.Input}>
                                <Input type="date" placeholder="Birthday"
                                       onChange={(e) => setBirthday(e.target.value)}/>
                            </div>
                            <Button colorScheme='blue' className={styles.button}
                                    onClick={() => signUp(email, password, name, birthday)}>登録</Button>
                        </TabPanel>

                    </TabPanels>
                </Tabs>


            </div>

        </div>


    );
};

export default Login;