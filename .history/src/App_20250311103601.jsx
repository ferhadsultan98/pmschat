import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router components
import ChatLayout from './Components/ChatLayout/ChatLayout';

// Example additional component (you can replace this with your own)
const Home = () => <h1>Home Page</h1>;

function App() {
  return (
    <div className="app">
      <Router> {/* Wrap your app in Router */}
        <Routes> {/* Define your routes */}
          <Route path="/" element={<Home />} /> {/* Home route */}
          <Route path="/chat" element={<ChatLayout />} /> {/* Chat route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;