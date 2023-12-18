import { Input, Stack } from "@chakra-ui/react";
import Styles from "../styles/Sidebar.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
function Sidebar() {
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
        <p> LearnWithStrangers! </p>
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
            />
          </Stack>
          <SearchIcon />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
