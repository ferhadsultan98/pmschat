import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatLayout from './Components/ChatLayout/ChatLayout';


const Home = () => <h1>Home Page</h1>;

function App() {
  return (
    <div className="app">
      <Router> 
        <Routes> 
          <Route path="/chat" element={<ChatLayout />} /> 
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;