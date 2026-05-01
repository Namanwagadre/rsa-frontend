import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const [role, setRole] = useState('user');
    const [isAvailable, setIsAvailable] = useState(true);

    // 👉 Edit feature ke liye naye states
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('Demo User'); 
    const [phone, setPhone] = useState('+91 9876543210');

   useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedName = localStorage.getItem('name');   // 👉 Real Name
        const storedPhone = localStorage.getItem('phone'); // 👉 Real Phone

        if (storedRole) {
            setRole(storedRole);
        }
        
        
        if (storedName) {
            setName(storedName);
        } else {
            setName(storedRole === 'mechanic' ? 'Mechanic User' : 'Customer User');
        }

        if (storedPhone) {
            setPhone(storedPhone);
        } else {
            setPhone('Phone number not found');
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSave = () => {
        // Yahan future mein backend API call lagayenge
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <Link to="/dashboard" className="back-link">
                ← Back to Dashboard
            </Link>

            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">
                        {role === 'mechanic' ? '👨‍🔧' : '👤'}
                    </div>
                    <h2 className="profile-name">{name}</h2>
                    <span className={`role-badge ${role}`}>
                        {role.toUpperCase()}
                    </span>
                </div>

                <div className="profile-details">
                    <div className="detail-header">
                        <h3>Personal Information</h3>
                        {!isEditing ? (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
                        ) : (
                            <button className="save-btn-small" onClick={handleSave}>💾 Save</button>
                        )}
                    </div>

                    <div className="detail-item">
                        <label>Full Name</label>
                        {isEditing ? (
                            <input type="text" className="edit-input" value={name} onChange={(e) => setName(e.target.value)} />
                        ) : (
                            <p className="detail-value">{name}</p>
                        )}
                    </div>
                    
                    <div className="detail-item">
                        <label>Phone Number</label>
                        {isEditing ? (
                            <input type="text" className="edit-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        ) : (
                            <p className="detail-value">{phone}</p>
                        )}
                    </div>

                    {role === 'mechanic' && (
                        <div className="status-section">
                            <div className="status-header">
                                <label>Current Status</label>
                                <span className={`status-dot ${isAvailable ? 'dot-online' : 'dot-offline'}`}></span>
                            </div>
                            <div className="status-toggle-wrapper">
                                <span className={`status-indicator ${isAvailable ? 'online' : 'offline'}`}>
                                    {isAvailable ? 'Available for Requests' : 'Busy / Offline'}
                                </span>
                                <button 
                                    className={`status-btn ${isAvailable ? 'btn-busy' : 'btn-available'}`}
                                    onClick={() => setIsAvailable(!isAvailable)}
                                >
                                    Go {isAvailable ? 'Offline' : 'Online'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    🚪 Logout 
                </button>
            </div>
        </div>
    );
}

export default Profile;