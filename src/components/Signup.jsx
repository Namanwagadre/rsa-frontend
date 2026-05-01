import React, { useState } from 'react';
import './Signup.css'; // Yahan CSS file link kar di hai

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Yahan aapka LIVE Render backend URL hai!
      const response = await fetch('https://rsa-backend-ze8f.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Registration Successful! ');
        // Agar aapke paas react-router-dom hai, toh yahan se login page par bhej sakte hain
      } else {
        alert('❌ Error: ' + data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Network error! .');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Naya Account Banayein 🚀</h2>
      
      <form className="signup-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          className="signup-input"
          placeholder="Aapka Naam" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          className="signup-input"
          placeholder="Email Address" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          className="signup-input"
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;