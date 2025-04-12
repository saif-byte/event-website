import React, { useState } from 'react';
import { apiCall } from '../../utils/api';
import { toast } from 'react-toastify';
import inputIcon from '../../assets/icons/input.svg';
import phoneIcon from '../../assets/icons/phone.svg';
import emailIcon from '../../assets/icons/email.svg';
import Header from '../Header/Header'
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phoneNo: '',
    email: '',
    message: '',
    agreeTerms: false // New field for checkbox
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await apiCall('/contact', 'POST', formData);

      toast.success('Your message has been sent successfully!');

      setFormData({
        name: '',
        lastName: '',
        phoneNo: '',
        email: '',
        message: '',
        agreeTerms: false
      });
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <><Header/>
    <div className="contact-us-container">
      <div className="contact-info">
        <h2>Contact Us</h2>
        <p>
          We've assembled an entire team of seasoned professionals dedicated to
          organizing group events of any size. With years of experience and a proven track
          record, our team ensures that every detail is expertly handled—from planning to
          execution.
        </p>

        <div className="call-us-section">
          <h3>Call Us</h3>
          <p>Call our team Mon to Fri 8:00 am to 7:00 pm</p>
          <a href="tel:+123456789" className="phone-number">+123 456 789</a>
        </div>
      </div>

      <div className="contact-form-wrapper">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <img src={inputIcon} className="input-icon" alt="" />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <img src={inputIcon} className="input-icon" alt="" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                />
              </div>
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <img src={phoneIcon} className="input-icon" alt="" />
              <input
                type="tel"
                name="phoneNo"
                placeholder="Phone No"
                value={formData.phoneNo}
                onChange={handleChange}
                className={errors.phoneNo ? 'error' : ''}
              />
            </div>
            {errors.phoneNo && <span className="error-text">{errors.phoneNo}</span>}
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <img src={emailIcon} className="input-icon" alt="" />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper textarea-wrapper">
              <img src={emailIcon} className="input-icon" alt="" />
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
                rows="4"
                cols="200"
              ></textarea>
            </div>
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          {/* Checkbox for agreeing to terms */}
          <div className="checkbox-group">
            <label htmlFor="agreeTerms" className="checkbox-label">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              I agree to the terms and conditions.
            </label>
            {errors.agreeTerms && (
              <span className="error-text">{errors.agreeTerms}</span>
            )}
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="send-button"
            disabled={formData.agreeTerms ? false : true}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>

          {/* Terms description */}
          <p className="terms-text">
            By Clicking Send you agree to terms and conditions. lorem ipsum dolor sit
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Contact;
