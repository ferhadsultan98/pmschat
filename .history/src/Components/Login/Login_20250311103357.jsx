import React, { useState } from 'react'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password]



  return (
    <div className="LoginContainer">
        <form action="" className="LoginForm">
            <label htmlFor="username"></label>
            <input type="text" id="username" />
        </form>
    </div>
  )
}

export default Login