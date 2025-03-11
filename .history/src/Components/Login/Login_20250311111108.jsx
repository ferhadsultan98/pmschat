import React, { useState } from "react";
import "./Login.scss";
import { IoMdLogIn } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="LoginContainer">
      <div className="LoginRegister">
        <div className="LoginSection">
          <IoMdLogIn />
          Login
        </div>
        <div className="RegisterSection">
          <MdAppRegistration />
          Registration
        </div>
      </div>
      <form action="#" className="LoginForm" style={{display: "none"}}>
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
      <form action="#">
        <label htmlFor="">Username</label>
        <input type="text" />
        
      </form>
    </div>
  );
};

export default Login;
