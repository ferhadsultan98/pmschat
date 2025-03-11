import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ChatLayout from "./Components/ChatLayout/ChatLayout";
import Login from "./Components/Login/Login";
import { isAuthenticated } from "./utils/auth";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="app">
      <Router>
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
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;