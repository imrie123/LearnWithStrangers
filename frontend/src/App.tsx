import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Myprofile from "./components/Myprofile";
import Findgroup from "./components/Findgroup";
import Findpost from "./components/Findpost";
import Seepost from "./components/Seepost";
import Findchat from "./components/Findchat";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Myprofile />} />
            <Route path="myprofile" element={<Myprofile />} />
            <Route path="findgroup" element={<Findgroup />} />
            <Route path="findpost" element={<Findpost />} />
            <Route path="seepost" element={<Seepost />} />
            <Route path="findchat" element={<Findchat />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

function MainLayout() {
  return (
    <>
      <Sidebar />
      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}

export default App;
