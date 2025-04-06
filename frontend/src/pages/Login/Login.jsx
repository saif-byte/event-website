import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api";
import { FaInstagram, FaEnvelope, FaLock } from "react-icons/fa"; // Icons
import "./Login.css"; // Import CSS
import Header from "../Header/Header";
import Carousel from "../../components/Carousel/Carousel"
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await apiCall("/auth/login", "POST", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user" , JSON.stringify(data.user))
      navigate("/dashboard");
    } catch (error) {
       toast.error("Invalid Credentials", {
              position: "top-center",  // You can change this based on your preference
              autoClose: 5000,        // Time in ms before the toast disappears
              hideProgressBar: true,  // Hide the progress bar
            });
    }
  };

  return (
    <>
    <Header/>
    <div className="login-container">
      <div className="testimonial-section">
     <Carousel/>
      </div>

      <div className="right-section">
        <h2 className="welcome-title">Welcome Back</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-signin">Sign in</button>
          <p className="forgot-password">Forgot Password?</p>
          

          <div className="separator">Or Continue with</div>

          <button className="btn-instagram">
            <FaInstagram className="icon" /> Instagram
          </button>
          <p className="login-redirect" style={{textAlign: "center"}}>
  Dont have an account? <span onClick={() => navigate('/signup')} className="login-link">Sign up</span>
</p> 
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
