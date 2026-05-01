import { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import './Login.css'; 

function Login() {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [isLoginMode, setIsLoginMode] = useState(location.pathname !== '/signup'); 

    useEffect(() => {
        setIsLoginMode(location.pathname !== '/signup');
    }, [location.pathname]);

    // Form states
    const [name, setName] = useState(''); 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); 
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage(isLoginMode ? 'Logging in...' : 'Signing up...'); 

        const url = isLoginMode 
            ? 'https://rsa-backend-ze8f.onrender.com/api/auth/login'
            : 'https://rsa-backend-ze8f.onrender.com/api/auth/register'; 

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
                    
                    localStorage.setItem('name', data.user.name || 'Demo User'); 
                    localStorage.setItem('phone', data.user.phoneNumber || data.user.phone || 'No Phone'); 

                    setTimeout(()=>{ navigate('/dashboard'); }, 1000);
                } else {
                    setMessage('🎉 Signup Successful! You can now login.');
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
            setMessage('🔌 Server error or no internet connection.');
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
                <p className={`message ${message.includes('Error') || message.includes('error') ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
            
            <form className="login-form" onSubmit={handleSubmit} autoComplete='off'>
              
              {!isLoginMode && (
                  <input 
                      className='login-input'
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLoginMode}
                  />
              )}

              {!isLoginMode && (
                  <select 
                      className='login-input select-role'
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required={!isLoginMode}
                  >
                      <option value="customer">As a User (Driver)</option>
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
                autoComplete='off'
              />

              <input 
                className='login-input'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='new-password'
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