import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login(){
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

   const handleLogin = async (e) => {
    e.preventDefault(); 
    setMessage('Logging in...'); // Thodi der loading dikhane ke liye

    try {
      // 1. Backend ko Parcel (Request) bhej rahe hain
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }), // Dabba pack kiya
      });

      // 2. Backend se jo jawab aaya usko padha
      const data = await response.json();

      if (response.ok) {
        setMessage(' Login Successful!');
        // 3. Token ko aage ke liye Browser ki tijori (localStorage) mein save kar liya
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role); 
        setTimeout(()=>{
            navigate('/dashboard');
        },1000);
        
        console.log("Token saved:", data.token);
      } else {
        setMessage(' Error: ' + data.message); // Agar password galat ho
      }

    } catch (error) {
      setMessage(' Server down hai ya internet nahi chal raha.');
    }
  };

    return (
        <div className='login-container'>
            <h2>Login to RSA</h2>
            {message && <p style={{ color: message.includes('Error') || message.includes('down') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}
            <form className="login-form" onSubmit={handleLogin}>

              <input 
                className='login-input'
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <input 
                className='login-input'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               />

               <button
                  className='login-button'
                   type="submit">
                    Login
                </button>
              
            </form>
        </div>
    );
}

export default Login;