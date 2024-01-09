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

function App() {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                dispatch(setToken(token));

            }


        }
        , [dispatch])


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
            <Route path="*" element={<MyprofilePage/>}/>
            <Route path="/Findchat" element={<FindchatPage/>}/>
            <Route path="/Findpost" element={<FindpostPage/>}/>
            <Route path="/Seepost" element={<SeepostPage/>}/>
            <Route path="/Findgroup" element={<FindgroupPage/>}/>

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
