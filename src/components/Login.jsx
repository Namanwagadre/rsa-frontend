import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Aapki alag CSS file

function Login() {
    const navigate = useNavigate();
    
    // Toggle state
    const [isLoginMode, setIsLoginMode] = useState(true); 

    // Form states
    const [name, setName] = useState(''); 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); // 👉 Naya state role ke liye
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage(isLoginMode ? 'Logging in...' : 'Signing up...'); 

        const url = isLoginMode 
            ? 'https://rsa-backend-ze8f.onrender.com/api/auth/login'
            : 'https://rsa-backend-ze8f.onrender.com/api/auth/register'; 

        // 👉 Signup mein 'role' bhi bhejenge
        const bodyData = isLoginMode 
            ? { phoneNumber, password } 
            : { name, phoneNumber, password, role };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData), 
            });

            const data = await response.json();

            if (response.ok) {
                if (isLoginMode) {
                    setMessage('✅ Login Successful!');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.user.role); 
                    setTimeout(()=>{ navigate('/dashboard'); }, 1000);
                } else {
                    setMessage('🎉 Signup Successful! Ab aap login kar sakte hain.');
                    setTimeout(() => { 
                        setIsLoginMode(true); 
                        setMessage(''); 
                        setPassword(''); 
                    }, 2000);
                }
            } else {
                setMessage('❌ Error: ' + data.message); 
            }
        } catch (error) {
            setMessage('🔌 Server down hai ya internet nahi chal raha.');
        }
    };

    return (
        <div className='login-container'>
            <h2>{isLoginMode ? 'Login to RSA' : 'Create New Account'}</h2>
            
            <div className="toggle-buttons">
                <button 
                    type="button"
                    className={`toggle-btn ${isLoginMode ? 'active-login' : ''}`}
                    onClick={() => { setIsLoginMode(true); setMessage(''); }}
                >
                    Login
                </button>
                <button 
                    type="button"
                    className={`toggle-btn ${!isLoginMode ? 'active-signup' : ''}`}
                    onClick={() => { setIsLoginMode(false); setMessage(''); }}
                >
                    Sign Up
                </button>
            </div>

            {message && (
                <p className={`message ${message.includes('Error') || message.includes('down') ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
            
            <form className="login-form" onSubmit={handleSubmit}>
              
              {/* Sirf Signup mode mein Name dikhega */}
              {!isLoginMode && (
                  <input 
                      className='login-input'
                      type="text"
                      placeholder="Aapka Naam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLoginMode}
                  />
              )}

              {/* 👉 NAYA HISSA: Sirf Signup mode mein Role Dropdown dikhega */}
              {!isLoginMode && (
                  <select 
                      className='login-input select-role'
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required={!isLoginMode}
                  >
                      <option value="customer"> As a User(Driver)</option>
                      <option value="mechanic">As a Mechanic</option>
                  </select>
              )}

              <input 
                className='login-input'
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />

              <input 
                className='login-input'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
               />

               <button 
                  className={`login-button ${isLoginMode ? 'btn-login' : 'btn-signup'}`} 
                  type="submit">
                  {isLoginMode ? 'Login' : 'Sign Up'}
               </button>
              
            </form>
        </div>
    );
}

export default Login;