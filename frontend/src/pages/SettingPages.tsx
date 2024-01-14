import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SettingPages() {
    const [name, setName] = useState('');
    const [learningLanguage, setLearningLanguage] = useState('');
    const [spokenLanguage, setSpokenLanguage] = useState('');
    const [residence, setResidence] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.post('http://127.0.0.1:3000/users/show', { token })
                .then((response) => {
                    const userData = response.data.user;
                    setName(userData.name);
                    setLearningLanguage(userData.learning_language);
                    setSpokenLanguage(userData.spoken_language);
                    setResidence(userData.residence);
                    setIntroduction(userData.introduction);
                    console.log(userData);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, []);

    const update = () => {
        const token = localStorage.getItem('token');
        axios.post('http://127.0.0.1:3000/users/update', {
            name,
            learningLanguage,
            spokenLanguage,
            residence,
            introduction,
            token
        })
            .then((response) => {
                setUser(response.data.user);
                console.log(response.data.user);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };


    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // フォームのデフォルトの動作を防止（ページのリロードを防ぐ）

        // フォームデータをサーバーに送信
        update();
    };

    return (
        <div>
            <h1>Setting</h1>

            <form  onSubmit={handleSubmit} >

                <div>
                    <label> 名前:</label>
                    <input
                        type="text"
                        id="username"
                        value={name}
                        placeholder={name}
                        onChange={(e) => setName(e.target.value)}

                    />
                </div>
                <div>
                    <label> 話せる言語:</label>
                    <input
                        type="text"
                        id="spokenLanguage"
                        value={spokenLanguage}
                        placeholder={"japanese"}
                        onChange={(e) => setSpokenLanguage(e.target.value)}
                    />

                </div>
                <div>
                    <label> 学びたい言語:</label>
                    <input
                        type="text"
                        id="learning_language"
                        value={learningLanguage}
                        placeholder={"English"}
                        onChange={(e) => setLearningLanguage(e.target.value)}
                    />
                </div>
                <div>
                    <label> 住んでる国:</label>
                    <input
                        type="text"
                        id="residence"
                        value={residence}
                        placeholder={"name"}
                        onChange={(e) => setResidence(e.target.value)}
                    />
                </div>
                <div>
                    <label> 自己紹介:</label>
                    <input
                        type="text"
                        id="introduction"
                        value={introduction}
                        placeholder={"Hello, I'm new here!"}
                        onChange={(e) => setIntroduction(e.target.value)}
                    />
                </div>
                <button type="submit">更新</button>

            </form>


        </div>
    );
}

export default SettingPages;
