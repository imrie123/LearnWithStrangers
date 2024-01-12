import {useState} from "react";
import {Input, Stack} from "@chakra-ui/react";
import Styles from "../styles/Sidebar.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import {Link} from "react-router-dom";
import {auth} from "../firebase";
import Login from "../pages/Login";
import {Logout} from "@mui/icons-material";
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {clearToken} from "../redux/authSlice";


function Sidebar() {

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
        console.log(e.target.value);
    };
    const logout = () => {
        dispatch(clearToken());
        auth.signOut();
        localStorage.removeItem('token');


    }

    const items = [
        {name: "プロフィール", path: ""},
        {name: "会話相手を探す", path: "/findchat"},
        {name: "グループチャットに参加する", path: "/findgroup"},
        {name: "みんなの投稿を見る", path: "/findpost"}
    ];
    return (
        <div className={Styles.sidebar}>
            <div className={Styles.header}>
                <Link to="/">
                    <p>LearnWithStrangers!</p>
                </Link>
            </div>

            <div className={Styles.list}>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <Link to={`/${item.path}`}>{item.name}</Link>
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
                    <SearchIcon/>
                    <button onClick={logout}>ログアウト</button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
