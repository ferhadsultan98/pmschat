import React, { useState } from "react";
import "./Login.scss";
import { IoMdLogIn } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
import { database, ref, push, get, set } from "../../Server/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Rastgele ID oluşturmak için uuid kütüphanesini ekle

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

  const handleFlip = (toRegister) => setIsFlipped(toRegister);

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error("Image upload failed: " + error.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const usersRef = ref(database, "users");

    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userFound = Object.entries(users).find(
          ([_, user]) => user.username === username && user.password === password
        );

        if (userFound) {
          const [userId, userData] = userFound;
          sessionStorage.setItem("userId", userId); 
          sessionStorage.setItem("username", userData.username);
          sessionStorage.setItem("fullName", userData.fullName);
          toast.success("Login successful! Redirecting...", {
            position: "top-right",
            autoClose: 2000,
          });
          setTimeout(() => navigate("/chat"), 2000);
        } else {
          toast.error("Invalid username or password", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      } else {
        toast.error("No users found in database", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error during login: " + error.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload an image", { position: "top-right", autoClose: 2000 });
      return;
    }

    try {
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
      toast.success("Registration successful! Please login.", {
        position: "top-right",
        autoClose: 2000,
      });
      setFullName("");
      setRegUsername("");
      setRegPassword("");
      setImageFile(null);
      setTimeout(() => setIsFlipped(false), 2000);
    } catch (error) {
      toast.error("Error during registration: " + error.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="loginContainer">
      <ToastContainer />
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