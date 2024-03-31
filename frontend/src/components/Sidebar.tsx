import {useState, useEffect} from "react";
import {Input, Stack} from "@chakra-ui/react";
import Styles from "../styles/Sidebar.module.scss";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {clearToken} from "../redux/authSlice";
import {Icon} from "@chakra-ui/react";
import {MdQuestionAnswer} from "react-icons/md";


function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState("");
    const [user, setUser] = useState({
        name: 'Loading...',
        learning_language: 'Loading...',
        spoken_language: 'Loading...',
        residence: 'Loading...',
        introduction: 'Loading...',
        avatar_url: 'Loading...',
        custom_id: 'Loading...'
    });

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
        console.log(e.target.value);
    };
    const logout = () => {
        dispatch(clearToken());

        localStorage.removeItem('token');
        navigate('/');
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me?token=${token}`)
                .then((response) => {
                    setUser(response.data.user);
                    console.log(response.data.user);

                    console.log(response.data.user);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, []);


    const items = [
        {name: "プロフィール", path: `/`, icon: <Icon as={MdQuestionAnswer}/>},
        {name: "会話相手を探す", path: "/findchat"},
        {name: "グループチャットに参加する", path: "/findgroup"},
        {name: "みんなの投稿を見る", path: "/findpost"}
    ];
    return (
        <div className={Styles.sidebar}>
            <div className={Styles.header}>
                <Link to={`/`}>
                    <p>LearnWithStrangers!</p>
                </Link>
            </div>

            <div className={Styles.list}>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link to={`${item.path}`}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
                <div className={Styles.search}>
                    <Stack spacing={3}>
                        <Input
                            variant="filled"
                            placeholder=""
                            size="sm"
                            width="140px"
                            borderRadius="10px"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </Stack>

                    <button onClick={logout}>ログアウト</button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
