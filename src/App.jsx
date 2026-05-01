import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // <-- Naya import
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';

function App(){
  return (
    <Router>
      <Routes>
        {/* Agar URL mein sirf '/' hai, toh ab mast Landing Page dikhao */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login aur Signup ke routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />

        {/* Agar URL mein '/dashboard' hai, toh Dashboard dikhao */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;