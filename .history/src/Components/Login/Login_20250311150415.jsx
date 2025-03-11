import React, { useState } from "react";
import "./Login.scss";
import { IoMdLogIn } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
import { database, ref, get, set } from "../../Server/Firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const cloudinaryPreset = "farhadsultan";
  const cloudinaryCloudName = "dbiltdpxh";

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/chat"); // Doğrudan burada yönlendirme yapıyoruz
  };

  const handleFlip = (toRegister) => setIsFlipped(toRegister);

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await response.json();
    return data.secure_url;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const usersRef = ref(database, "users");

    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const userFound = Object.entries(users).find(
        ([_, user]) => user.username === username && user.password === password
      );

      if (userFound) {
        const [userId, userData] = userFound;
        const user = { userId, username: userData.username, fullName: userData.fullName };
        login(user); // Giriş yap ve yönlendir
      } else {
        alert("Invalid username or password"); // Toast yerine basit alert
      }
    } else {
      alert("No users found in database");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    const imageUrl = await uploadImageToCloudinary(imageFile);
    const userId = uuidv4();
    const usersRef = ref(database, `users/${userId}`);
    const newUser = {
      fullName,
      username: regUsername,
      password: regPassword,
      avatar: imageUrl,
      createdAt: Date.now(),
    };

    await set(usersRef, newUser);
    alert("Registration successful! Please login.");
    setFullName("");
    setRegUsername("");
    setRegPassword("");
    setImageFile(null);
    setIsFlipped(false); // Kayıttan sonra login ekranına dön
  };

  return (
    <div className="loginContainer">
      <div className="loginRegister">
        <div className={`loginSection ${!isFlipped ? "active" : ""}`} onClick={() => handleFlip(false)}>
          <IoMdLogIn /> Login
        </div>
        <div className={`registerSection ${isFlipped ? "active" : ""}`} onClick={() => handleFlip(true)}>
          <MdAppRegistration /> Registration
        </div>
      </div>

      <div className="cardContainer">
        <div className={`card ${isFlipped ? "flipped" : ""}`}>
          <div className="cardFront">
            <form onSubmit={handleLoginSubmit} className="loginRegisterForm">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="off"
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="off"
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
                autoComplete="off"
              />
              <label htmlFor="regUsername">Username</label>
              <input
                type="text"
                id="regUsername"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Username"
                autoComplete="off"
              />
              <label htmlFor="regPassword">Password</label>
              <input
                type="password"
                id="regPassword"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Password"
                autoComplete="off"
              />
              <label htmlFor="image">Profile Image (Required)</label>
              <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
              {imageFile && (
                <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ maxWidth: "30px" }} />
              )}
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;