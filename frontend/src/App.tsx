import React, {useEffect} from "react";
import "./App.css";
import MyprofilePage from "./pages/MyprofilePage";
import FindchatPage from "./pages/FindchatPage";
import {useDispatch, useSelector} from "react-redux";
import {
    Routes,
    Route,
    BrowserRouter,
} from "react-router-dom";
import {RootState} from "./redux/store";
import FindpostPage from "./pages/FindpostPage";
import SeepostPage from "./pages/SeepostPage";
import FindgroupPage from "./pages/FindgroupPage";
import Login from "./pages/Login";
import {setToken} from "./redux/authSlice";
import SettingPages from "./pages/SettingPages";
import {useState} from "react";
import axios from "axios";
import AddpostPage from "./pages/AddpostPage";
import EditpostPage from "./pages/EditpostPage";
function App() {
    const token = useSelector((state: RootState) => state.auth.token);


    return (

        <BrowserRouter>

            <Routes>
                {token ? (
                    <>
                        <Route path="*" element={<AuthenticatedRoutes/>}/>
                    </>
                ) : (
                    <Route path="*" element={<UnauthenticatedRoutes/>}/>
                )}


            </Routes>

        </BrowserRouter>


    );
}





function AuthenticatedRoutes() {
    return (
        <Routes>
            <Route path="*" element={<MyprofilePage />}/>
            <Route path="/findchat" element={<FindchatPage/>}/>
            <Route path="/findpost" element={<FindpostPage/>}/>
            <Route path="/seepost" element={<SeepostPage/>}/>
            <Route path="/findgroup" element={<FindgroupPage/>}/>
            <Route path="/setting" element={<SettingPages/>}/>
            <Route path="/addpost" element={<AddpostPage/>}/>
            <Route path='/editpost/:post_id' element={<EditpostPage/>}/>

        </Routes>
    )
}

function UnauthenticatedRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
        </Routes>
    )
}


export default App;
