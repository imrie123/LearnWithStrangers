import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import styles from '../styles/Setting.module.scss';
import {Button, Input} from '@chakra-ui/react';
import {Select} from '@chakra-ui/react';
import axiosInstance from '../services/axiosInstance.js';
function Setting() {

    const [name, setName] = useState('');
    const [learningLanguage, setLearningLanguage] = useState('');
    const [spokenLanguage, setSpokenLanguage] = useState('');
    const [residence, setResidence] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [id, setId] = useState(null);
    const [profileImage, setProfileImage] = useState<FormData>();
    const [avatar_url, setAvatarUrl] = useState('');
    const residenceOptions = ["Japan", "Korea", "China", "USA", "UK", "France", "Germany", "Italy", "Spain", "Russia", "India", "Brazil", "Canada", "Australia", "Other"];
    const learningLanguageOptions = ["Japanese", "Korean", "Chinese", "English", "French", "German", "Italian", "Spanish", "Russian", "Hindi", "Portuguese", "Other"];
    const spokenLanguageOptions = ["Japanese", "Korean", "Chinese", "English", "French", "German", "Italian", "Spanish", "Russian", "Hindi", "Portuguese", "Other"];

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const fileObject = e.target.files[0];
        const formData = new FormData();
        formData.append('user[avatar]', fileObject);
        setProfileImage(formData);
    };

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');


        if (token) {
            axiosInstance.get(`/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    const userData = response.data.user;
                    setName(userData.name);
                    setLearningLanguage(userData.learning_language);
                    setSpokenLanguage(userData.spoken_language);
                    setResidence(userData.residence);
                    setIntroduction(userData.introduction);
                    setAvatarUrl(userData.avatar_url);
                    setId(userData.id)
                    console.log(userData);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [id]);

    const update = () => {
        const token = localStorage.getItem('token');
        console.log(`Learning Language: ${learningLanguage}`);
        console.log(`Spoken Language: ${spokenLanguage}`);
        axiosInstance.post('/users/update', {
            name: name,
            learning_language: learningLanguage,
            spoken_language: spokenLanguage,
            residence,
            introduction
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data.user);
                navigate("/myprofile");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    const upload = () => {
        const token = localStorage.getItem('token');
        axiosInstance.post(`/users/avatar`, profileImage, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        })
            .catch((error) => {
                console.error("Error:", error);
            });
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form behavior (page reload)

        // Send form data to the server
        update();
        if (profileImage) {
            upload();
        }

        navigate("/");
    };

    return (
        <div className={styles.setting}>
            <h1>Edit User Information</h1>
            <div className={styles.myprofile}>
                <div className={styles.component}>
                    <div className={styles.top}>
                        <div className={styles.introduce}>
                            <img className={styles.avatar} src={`http://localhost:3000${avatar_url}`} alt="avatar"/>
                            <div className={styles.info}>
                                <div className={styles.user}>
                                    <p>Name:{name}</p>
                                    <p>Spoken Language: {spokenLanguage}</p>
                                    <p>Learning Language: {learningLanguage}</p>
                                    <p>Residence: {residence}</p>
                                    <p>Introduction: {introduction}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.update}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <input type="file" accept="image/*" onChange={onFileInputChange}/>

                        </div>
                        <label> Name:</label>
                        <Input
                            type="text"
                            id="username"
                            value={name}
                            placeholder={name}
                            onChange={(e) => setName(e.target.value)}

                        />
                    </div>
                    <div>
                        <label> Spoken Language:</label>
                        <Select
                            id="spokenLanguage"
                            value={spokenLanguage}
                            placeholder={spokenLanguage}
                            onChange={(e) => {
                                setSpokenLanguage(e.target.value)
                                console.log(`Selected Spoken Language: ${e.target.value}`)
                            }
                            }

                        >
                            {spokenLanguageOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label> Learning Language:</label>
                        <Select
                            id="learningLanguage"
                            value={learningLanguage}
                            placeholder={learningLanguage}
                            onChange={(e) => setLearningLanguage(e.target.value)}

                        >
                            {learningLanguageOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label> Residence:</label>
                        <Select
                            id="residence"
                            value={residence}
                            placeholder={residence}
                            onChange={(e) => setResidence(e.target.value)}

                        >
                            {residenceOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label> Introduction:</label>
                        <Input
                            type="text"
                            id="introduction"
                            value={introduction}
                            placeholder={"Hello, I'm new here!"}
                            onChange={(e) => setIntroduction(e.target.value)}
                        />
                    </div>
                    <Button type="submit" colorScheme='blue' className={styles.update_button}>Update</Button>
                </form>
            </div>
        </div>
    );
}

export default Setting;
