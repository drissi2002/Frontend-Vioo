import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import Home from "./components/Home";
import Profile from "./components/Authentication/Profile";
import BoardUser from "./components/Board/BoardUser";
import BoardAdmin from "./components/Board/BoardAdmin";

import EventBus from "./common/EventBus";
import Unauthorized from "./components/Authentication/Unauthorized";
import GuestGuard from "./guards/GuestGuard"; 
import AuthGuard from "./guards/AuthGuard"; 

const App = () => {

  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand">
        <Link to={"/"} className="navbar-brand">
          V-IOO
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin-Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
              Visualization
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Logout
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={ <Home/>}/>

          {/* we want to protect these routes */} 

          <Route path="/login" element={<GuestGuard><Login/></GuestGuard>} />
          <Route path="/register" element={<GuestGuard><Register/></GuestGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile/></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard><BoardAdmin/></AuthGuard>}/>
          <Route path="/user" element={<AuthGuard><BoardUser/></AuthGuard>} />
          <Route path="/unauthorized" element={<Unauthorized/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;