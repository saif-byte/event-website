import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../utils/api"; // Import API helper
import Header from "../Header/Header"; // Import Header component
import "./Signup.css";
import { FaEye, FaEyeSlash, FaInstagram } from 'react-icons/fa';
import Carousel from "../../components/Carousel/Carousel";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagramHandle: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const instagramHandleRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[A-Za-z0-9._]{1,30}$/;

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.instagramHandle.trim()) {
      newErrors.instagramHandle = "Instagram Handle is required";
    } else if (!instagramHandleRegex.test(formData.instagramHandle)) {
      newErrors.instagramHandle = "Invalid Instagram handle.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        instagramHandle: formData.instagramHandle,
        gender: formData.gender.toUpperCase(),
        password: formData.password,
      };

      await apiCall("/auth/signup", "POST", data);
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Header />

      <main className="main-content">
        {/* Left Side - Testimonial */}
        <div className="testimonial-section">
          <Carousel />
        </div>

        {/* Right Side - Signup Form */}
        <div className="signup-form-section">
          <h1 className="welcome-title">Sign Up</h1>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <input type="text" name="instagramHandle" placeholder="Instagram Handle" value={formData.instagramHandle} onChange={handleInputChange} />
              {errors.instagramHandle && <p className="error">{errors.instagramHandle}</p>}
            </div>

            <div className="form-group">
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>

            <div className="form-group password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="form-group password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn-signin">Sign up</button>
            <p className="login-redirect">
              Already have an account? <span onClick={() => navigate('/login')} className="login-link">Sign in</span>
            </p>
            <div className="separator">Or Continue with</div>

            <button className="btn-instagram">
              <FaInstagram className="icon" /> Instagram
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
