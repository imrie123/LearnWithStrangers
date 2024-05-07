import React, {useEffect} from "react";
import {RootState} from "./redux/store";
import {setToken} from "./redux/authSlice";
import {useSelector, useDispatch} from "react-redux";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MyprofilePage from "./pages/MyprofilePage";
import FindchatPage from "./pages/FindchatPage";
import FindpostPage from "./pages/FindpostPage";
import SeepostPage from "./pages/SeepostPage";
import FindgroupPage from "./pages/FindgroupPage";
import Login from "./pages/Login";
import SettingPages from "./pages/SettingPages";
import AddpostPage from "./pages/AddpostPage";
import EditpostPage from "./pages/EditpostPage";
import OtherUserProfilePage from "./pages/OtherUserProfilePage";
import ChatPage from "./pages/ChatPage";
import GroupChatPage from "./pages/GroupChatPage";

function App() {
    const token = useSelector((state: RootState) => state.auth.token);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            // tokenがなかったら、localStorageから取得して、dispatchでstoreに保存する
            const localToken = localStorage.getItem("token");
            if (localToken) {
                dispatch(setToken(localToken));
            }
        }
    }, [token]);

    return (
        <BrowserRouter>
            <Routes>
                {token ?
                    <Route path="*" element={<AuthenticatedRoutes/>}/> :
                    <Route path="*" element={<UnauthenticatedRoutes/>}/>
                }
            </Routes>
        </BrowserRouter>
    );
}

function AuthenticatedRoutes() {
    return (
        <Routes>
            <Route path="*" element={<MyprofilePage/>}/>
            <Route path="/findchat" element={<FindchatPage/>}/>
            <Route path="/findpost" element={<FindpostPage/>}/>
            <Route path="/seepost" element={<SeepostPage/>}/>
            <Route path="/findgroup" element={<FindgroupPage/>}/>
            <Route path="/setting" element={<SettingPages/>}/>
            <Route path="/addpost" element={<AddpostPage/>}/>
            <Route path="/editpost/:post_id" element={<EditpostPage/>}/>
            <Route path="/user/:custom_id" element={<OtherUserProfilePage/>}/>\
            <Route path="/:custom_id/:id/:name" element={<ChatPage/>}/>
            <Route path="/group/:id" element={<GroupChatPage/>}/>
        </Routes>
    );
}

function UnauthenticatedRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
        </Routes>
    );
}

export default App;
