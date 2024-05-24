import {useEffect} from "react";
import Styles from "../styles/Sidebar.module.scss";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useDispatch} from "react-redux";
import {clearToken} from "../redux/authSlice";
import {Icon} from "@chakra-ui/react";
import {MdQuestionAnswer} from "react-icons/md";

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const logout = () => {
        dispatch(clearToken());
        localStorage.removeItem('token');
        navigate('/');
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://127.0.0.1:3000/users/me`, {
                headers: {Authorization: `Bearer ${token}`}
            }).catch((error) => {
                console.error("Error:", error);
            });
        }
    }, []);

    const items = [
        {name: "プロフィール", path: `/`, icon: <Icon as={MdQuestionAnswer}/>},
        {name: "メッセージ", path: "/message"},
        {name: "会話相手を探す", path: "/findchat"},
        {name: "グループチャットに参加する", path: "/findgroup"},
        {name: "フォローしているユーザーの投稿", path: "/findpost"},
        {name: "検索", path: "/search"}
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
                            <Link to={item.path}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
                <div className={Styles.search}>
                    <button onClick={logout}>ログアウト</button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
