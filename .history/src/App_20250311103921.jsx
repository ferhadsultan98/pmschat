import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatLayout from "./Components/ChatLayout/ChatLayout";
import Login from "./Components/Login/Login";



function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<ChatLayout />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
