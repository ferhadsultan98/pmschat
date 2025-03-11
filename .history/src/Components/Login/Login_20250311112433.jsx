// Login.jsx
import React, { useState } from "react";
import "./Login.scss";
import { IoMdLogIn } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
import { database, ref, push } from "../../Server/Firebase";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (toRegister) => {
    setIsFlipped(toRegister);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", { username, password });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const usersRef = ref(database, "users");
    const newUser = {
      fullName,
      username: regUsername,
      password: regPassword, 
      createdAt: Date.now()
    };

    push(usersRef, newUser)
      .then(() => {
        console.log("Registration successful");
        setFullName("");
        setRegUsername("");
        setRegPassword("");
        setIsFlipped(false); // Switch back to login after successful registration
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
  };

  return (
    <div className="loginContainer">
      <div className="loginRegister">
        <div 
          className={`loginSection ${!isFlipped ? 'active' : ''}`}
          onClick={() => handleFlip(false)}
        >
          <IoMdLogIn />
          Login
        </div>
        <div 
          className={`registerSection ${isFlipped ? 'active' : ''}`}
          onClick={() => handleFlip(true)}
        >
          <MdAppRegistration />
          Registration
        </div>
      </div>
      
      <div className="cardContainer">
        <div className={`card ${isFlipped ? 'flipped' : ''}`}>
          <div className="cardFront">
            <form onSubmit={handleLoginSubmit} className="loginRegisterForm">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button type="submit">Login</button>
            </form>
          </div>

          <div className="cardBack">
            <form onSubmit={handleRegisterSubmit} className="loginRegisterForm">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
              />
              <label htmlFor="regUsername">Username</label>
              <input
                type="text"
                id="regUsername"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Username"
              />
              <label htmlFor="regPassword">Password</label>
              <input
                type="password"
                id="regPassword"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Password"
              />
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;