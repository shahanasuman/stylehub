import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mycontext } from "./Context";
import axios from "axios";
import './all.css';

export default function Register() {
  const { setLogUser } = useContext(mycontext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      setLogUser({ token, user });
      localStorage.setItem('token', token);
      alert("User Registered Successfully! Please login...");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      <div className="register-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleButtonClick} type="button">Submit</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
