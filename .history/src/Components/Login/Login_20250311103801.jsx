import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="LoginContainer">
      <form action="" className="LoginForm">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={(e) => setUsername(e.target.value)}
          onChange={}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={(e) => setPassword(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Login;
