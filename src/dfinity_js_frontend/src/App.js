import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import "./styles/tailwind.css";
import "./styles/font.css";
import "./index.css";

// src/dfinity_js_frontend/src/index.css
// import "./styles/font.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import UserProfile from "./pages/Profile/Profile";
import Profile from "./pages/Profile/UserDashboard";



const App = function AppWrapper() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
 
 
    </>
  );
};

export default App;
