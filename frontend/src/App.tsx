import React, { useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MyprofilePage from "./pages/MyprofilePage";
import FindchatPage from "./pages/FindchatPage";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { RootState } from "./redux/store";
import { auth } from "./firebase";
import { login, logout } from "./redux/userSlice";
import FindpostPage from "./pages/FindpostPage";
import SeepostPage from "./pages/SeepostPage";
import FindgroupPage from "./pages/FindgroupPage";
import Login from "./pages/Login";
import { useState } from "react";
import { Logout } from "@mui/icons-material";
function App() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
 
 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      console.log(firebaseUser);
      if (firebaseUser) {
        dispatch(login({
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        }));
      } else {
        dispatch(logout());
      }

    });

    return unsubscribe;
  }, [dispatch]);


  return (
    
    <BrowserRouter>
     
      <Routes>
        {user ? (
          <>
       <Route path="*" element={<AuthenticatedRoutes/>}/>
            </>
        ):(
          <Route path="*" element={<UnauthenticatedRoutes/>}/>
        )}
  
   
    </Routes>
  
    </BrowserRouter>
    
 
  
  );
}

function AuthenticatedRoutes() {
  return(
    <Routes>
       <Route path="*" element={<MyprofilePage />} />
      <Route path="/Findchat" element={<FindchatPage />} />
      <Route path="/Findpost" element={<FindpostPage />} />
      <Route path="/Seepost" element={<SeepostPage />} />
      <Route path="/Findgroup" element={<FindgroupPage />} />
     
    </Routes>
  )
}

function UnauthenticatedRoutes() {
  return(
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  )
}


export default App;
