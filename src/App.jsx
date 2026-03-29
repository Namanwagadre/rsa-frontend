import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';


function App(){
  return (
    <Router>
      <Routes>
        {/* Agar URL mein sirf '/' hai, toh Login page dikhao */}
        <Route path="/" element={<Login />} />
      

        {/* Agar URL mein '/dashboard' hai, toh Dashboard dikhao */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;