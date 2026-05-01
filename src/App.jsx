import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // <-- Naya import
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Profile from './components/Profile';

function App(){
  return (
    <Router>
      <Routes>
        {/* Agar URL mein sirf '/' hai, toh ab mast Landing Page dikhao */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login aur Signup ke routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />

        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;