import { useState } from "react";
import { Input, Stack } from "@chakra-ui/react";
import Styles from "../styles/Sidebar.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
function Sidebar() {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };
  const items = [
    { name: "プロフィール", path: "myprofile" },
    { name: "会話相手を探す", path: "findchat" },
    { name: "グループチャットに参加する", path: "findgroup" },
    { name: "みんなの投稿を見る", path: "findpost" },
    { name: "ログアウト" },
  ];
  return (
    <div className={Styles.sidebar}>
      <div className={Styles.header}>
        <Link to="/myprofile">
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
          <SearchIcon />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
