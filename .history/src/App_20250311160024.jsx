import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ChatProvider } from "./ChatContext"; // Context sağlayıcıyı içe aktar
import ChatLayout from "./Components/ChatLayout/ChatLayout";
import Login from "./Components/Login/Login";

function App() {

  const isAuthenticated = () => !!localStorage.getItem("user");

  return (
    <div className="app">
      <Router>
        <ChatProvider> {/* Tüm uygulamayı ChatProvider ile sar */}
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated() ? <Navigate to="/chat" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated() ? <ChatLayout /> : <Navigate to="/login" />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;