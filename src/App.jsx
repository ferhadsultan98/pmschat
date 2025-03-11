import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ChatLayout from "./Components/ChatLayout/ChatLayout";
import Login from "./Components/Login/Login";

function App() {

  const isAuthenticated = () => !!localStorage.getItem('user');

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/chat" /> : <Navigate to="/login" />}
          />
          <Route path="/chat" element={<ChatLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;