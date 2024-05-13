import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import styles from '../styles/Setting.module.scss';
import {Button, Input} from '@chakra-ui/react'
import {Select} from '@chakra-ui/react'

function Setting() {

    const [name, setName] = useState('');
    const [learningLanguage, setLearningLanguage] = useState('');
    const [spokenLanguage, setSpokenLanguage] = useState('');
    const [residence, setResidence] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [id, setId] = useState(null);
    const [profileImage, setProfileImage] = useState<FormData>();
    const [avatar_url, setAvatarUrl] = useState('');
    const residenceOptions = ["japan", "korea", "china", "usa", "uk", "france", "germany", "italy", "spain", "russia", "india", "brazil", "canada", "australia", "other"];
    const learningLanguageOptions = ["japanese", "korean", "chinese", "english", "french", "german", "italian", "spanish", "russian", "hindi", "portuguese", "other"];
    const spokenLanguageOptions = ["japanese", "korean", "chinese", "english", "french", "german", "italian", "spanish", "russian", "hindi", "portuguese", "other"];

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
            axios.get(`http://127.0.0.1:3000/users/me`, {
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
        axios.post('http://127.0.0.1:3000/users/update', {
            name: name,
            learning_language: learningLanguage,
            spoken_language: spokenLanguage,
            residence,
            introduction,
            token
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
        axios.post(`http://127.0.0.1:3000/users/avatar`, profileImage, {
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
        e.preventDefault(); // フォームのデフォルトの動作を防止（ページのリロードを防ぐ）

        // フォームデータをサーバーに送信
        update();
        if (profileImage) {
            upload();
        }

        navigate("/");
    };

    return (
        <div className={styles.setting}>
            <h1>ユーザー情報を変更する</h1>
            <div className={styles.myprofile}>
                <div className={styles.component}>
                    <div className={styles.top}>
                        <div className={styles.introduce}>
                            <img className={styles.avatar} src={`http://localhost:3000${avatar_url}`} alt="avatar"/>
                            <div className={styles.info}>
                                <div className={styles.user}>
                                    <p>{name}</p>
                                    <p>話せる言語:{spokenLanguage}</p>
                                    <p>学びたい言語:{learningLanguage}</p>
                                    <p>住んでいる国:{residence}</p>
                                    <p>自己紹介:{introduction}</p>
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
                        <label> 名前:</label>
                        <Input
                            type="text"
                            id="username"
                            value={name}
                            placeholder={name}
                            onChange={(e) => setName(e.target.value)}

                        />
                    </div>
                    <div>
                        <label> 話せる言語:</label>
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
                        <label> 学びたい言語:</label>
                        <Select
                            id="learningLanguage"
                            value={learningLanguage}
                            placeholder={learningLanguage}
                            onChange={(e) => setLearningLanguage(e.target.value)}

                        >
                            {learningLanguageOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                )
                            )}
                        </Select>
                    </div>
                    <div>
                        <label> 住んでる国:</label>
                        <Select
                            id="residence"
                            value={residence}
                            placeholder={residence}
                            onChange={(e) => setResidence(e.target.value)}

                        >
                            {residenceOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                )
                            )}
                        </Select>
                    </div>
                    <div>
                        <label> 自己紹介:</label>
                        <Input
                            type="text"
                            id="introduction"
                            value={introduction}
                            placeholder={"Hello, I'm new here!"}
                            onChange={(e) => setIntroduction(e.target.value)}
                        />
                    </div>
                    <Button type="submit" colorScheme='blue' className={styles.update_button}>更新</Button>
                </form>
            </div>
        </div>
    );
}

export default Setting;
