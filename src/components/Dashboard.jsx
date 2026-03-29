import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  
  const role = localStorage.getItem('role'); 
  const token = localStorage.getItem('token'); 

  // States
  const [problem, setProblem] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(''); 
  const [vehicleId, setVehicleId] = useState(''); 
  const [message, setMessage] = useState('');
  const [vehicles, setVehicles] = useState([]); 
  
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [customerActiveReq, setCustomerActiveReq] = useState(null);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');


  // Fetch Vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      if (role === 'customer') {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/vehicles', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) setVehicles(data.vehicles || []); 
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        }
      }
    };
    fetchVehicles();
  }, [role, token]);


  // Status fetch karne ka function
  const fetchCustomerActiveReq = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/requests/customer-active', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setCustomerActiveReq(data.request || null);
    } catch (error) {
      console.error("Error fetching active request");
    }
  };

  // Page khulte hi fetch karein
  useEffect(() => {
    if (role === 'customer') {
      fetchCustomerActiveReq();
    }
  }, [role, token]);

  // Fetch History (For both Customer & Mechanic)
  const fetchHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/requests/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Page khulte hi History load karein
  useEffect(() => {
    fetchHistory();
  }, [role, token]);

  // Fetch Active Requests (Mechanic)
  const fetchActiveRequests = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/requests/my-accepted', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setActiveRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching active requests:", error);
    }
  };

  useEffect(() => {
    if (role === 'mechanic') {
      fetchActiveRequests();
    }
  }, [role, token]);

  // Add Vehicle
  const handleAddVehicle = async () => {
    if (!make || !model || !year || !licensePlate) {
      setMessage(' Please fill in all the vehicle details!');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/api/vehicles/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ make, model, year, licensePlate })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Vehicle added successfully!');
        setVehicles([...vehicles, data.vehicle]); 
        setMake(''); setModel(''); setYear(''); setLicensePlate('');
      } else {
        setMessage(' Error: ' + data.message);
      }
    } catch (error) {
      setMessage(' Server Error: Could not save the vehicle.');
    }
  };

  // Send SOS
  const handleSOS = async () => {
    if (!problem || !vehicleId) {
      setMessage(' Please select both a vehicle and an issue.');
      return;
    }
    if (!navigator.geolocation) {
      setMessage(' Your browser does not support GPS location.');
      return;
    }

    setMessage('⏳ Fetching your current location...');

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        const response = await fetch('http://127.0.0.1:5000/api/requests/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ serviceType: problem, latitude: lat, longitude: lng, vehicleId: vehicleId }),
        });
        const data = await response.json();
        if (response.ok) {
          setMessage(' SOS Sent! Nearby mechanics have been alerted.');
          setProblem(''); setVehicleId(''); 
          fetchCustomerActiveReq();
        } else {
          setMessage(' Error: ' + (data.error || data.message));
        }
      } catch (error) {
        setMessage(' Server error or no internet connection.');
      }
    }, () => {
      setMessage(' Location access was denied.');
    });
  };

  // Accept Request
  const handleAcceptRequest = async (reqId) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/requests/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ requestId: reqId })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Request Accepted! You can now view the customer location.');
        setPendingRequests(pendingRequests.filter(req => req._id !== reqId));
        fetchActiveRequests(); 
      } else {
        setMessage(' Error: ' + data.message);
      }
    } catch (error) {
      setMessage(' Server Error: Could not accept the request.');
    }
  };

  // Complete Request
  const handleCompleteRequest = async (reqId) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/requests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ requestId: reqId })
      });
      
      if (response.ok) {
        setMessage('🎉 Great Job! The vehicle is fixed. You are now available for new requests.');
        setActiveRequests(activeRequests.filter(req => req._id !== reqId));
      } else {
        setMessage(' Error while completing the request.');
      }
    } catch (error) {
      setMessage(' Server Error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to RSA App 🚗</h1>
      <h2>Your Role: <span className="role-text">{role}</span></h2>
      {message && <p className="status-message">{message}</p>}
      <hr className="divider" />

      {role === 'customer' && (
        <>
          <div className="add-vehicle-section">
            <h3 className="section-title">➕ Add a New Vehicle</h3>
            <div className="input-group">
              <input type="text" placeholder="Make (e.g. Tata)" className="problem-input half-width" value={make} onChange={(e) => setMake(e.target.value)} />
              <input type="text" placeholder="Model (e.g. Nexon)" className="problem-input half-width" value={model} onChange={(e) => setModel(e.target.value)} />
              <input type="number" placeholder="Year (e.g. 2023)" className="problem-input half-width" value={year} onChange={(e) => setYear(e.target.value)} />
              <input type="text" placeholder="License Plate (e.g. MP09 AB 1234)" className="problem-input half-width" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
            </div>
            <button className="save-btn" onClick={handleAddVehicle}>Save Vehicle 🚗</button>
          </div>

          {/* --- NAYA: CUSTOMER LIVE TRACKING BOX --- */}
          {customerActiveReq && (
            <div className="tracking-box">
              <h3 className="section-title">📍 Live SOS Status</h3>
              
              {customerActiveReq.status === 'pending' ? (
                <div className="status-pending-text">
                  ⏳ Searching for nearby mechanics...
                </div>
              ) : (
                <div className="status-accepted-text">
                  🚗 Mechanic is on the way! (ETA: 10-15 mins)
                </div>
              )}
              
              <p className="tracking-note">Please stay safely inside or near your vehicle.</p>
              
              <button className="refresh-btn" onClick={fetchCustomerActiveReq}>
                🔄 Refresh Status
              </button>
            </div>
          )}

          <div className="customer-section">
            <h3 className="section-title">🚨 Need Emergency Assistance?</h3>
            <select className="problem-input" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              <option value="" disabled>Select Your Vehicle...</option>
              {vehicles.map((car) => <option key={car._id} value={car._id}>{car.make} {car.model} ({car.licensePlate})</option>)}
            </select>
           <select 
              className="problem-input" 
              value={problem} 
              onChange={(e) => {
                const selectedProblem = e.target.value;
                setProblem(selectedProblem);
                // JADU: Problem ke hisaab se price set karo
                if (selectedProblem === 'Towing') setEstimatedPrice('₹1000 - ₹1500 (Depends on distance)');
                else if (selectedProblem === 'Flat Tire') setEstimatedPrice('₹200 - ₹300');
                else if (selectedProblem === 'Battery Jump-start') setEstimatedPrice('₹300 - ₹500');
                else if (selectedProblem === 'Fuel Delivery') setEstimatedPrice('₹150 (Delivery) + Fuel Cost');
                else if (selectedProblem === 'Breakdown Repair') setEstimatedPrice('₹500 (Visiting Charge) + Parts');
              }}
            >
              <option value="" disabled>What seems to be the problem?</option>
              <option value="Towing">Towing</option>
              <option value="Flat Tire">Flat Tire</option>
              <option value="Battery Jump-start">Battery Jump-start</option>
              <option value="Fuel Delivery">Fuel Delivery</option>
              <option value="Breakdown Repair">Breakdown Repair</option>
            </select>

            {/* PRICING DIKHANE WALA DABBA */}
            {problem && (
              <div className="pricing-box">
                <strong>💰 Estimated Cost:</strong> {estimatedPrice}
                <span className="pricing-note">
                  *Pay directly to the mechanic via Cash/UPI after service.
                </span>
              </div>
            )}
            <button className="sos-btn full-width" onClick={handleSOS}>🚨 GET LOCATION & SEND SOS</button>
          </div>
        </>
      )}

      {role === 'mechanic' && (
        <div className="mechanic-section">
          
          <div className="pending-box">
            <h3 className="section-title">🔔 New Requests (Pending)</h3>
            <button className="check-requests-btn full-width" onClick={async () => {
              setMessage('⏳ Checking for new requests...');
              try {
                const response = await fetch('http://127.0.0.1:5000/api/requests/pending', { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await response.json();
                if (response.ok) {
                  setPendingRequests(data.requests || []); 
                  setMessage(`✅ Found ${data.requests.length} new request(s)!`);
                }
              } catch (error) { setMessage('❌ Server Error'); }
            }}>
              🔄 Refresh Requests
            </button>

            <div className="requests-container">
              {pendingRequests.length === 0 ? (
                <p className="empty-text">No new requests at the moment.</p>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req._id} className="request-card new-card">
                    <div className="req-header">
                      <h4 className="text-red">🚨 {req.serviceType}</h4>
                      <span className="time-badge red-badge">New</span>
                    </div>
                    <p><strong>Vehicle:</strong> {req.vehicleId ? `${req.vehicleId.make} ${req.vehicleId.model} (${req.vehicleId.licensePlate})` : 'Details Missing'}</p>
                    <button className="accept-btn" onClick={() => handleAcceptRequest(req._id)}>✅ Accept Request</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <hr className="divider" />

          <div className="active-box">
            <h3 className="section-title">🚗 My Active Requests (In Progress)</h3>
            <div className="requests-container">
              {activeRequests.length === 0 ? (
                <p className="empty-text">You have no active requests right now.</p>
              ) : (
                activeRequests.map((req) => (
                  <div key={req._id} className="request-card active-card">
                    <div className="req-header">
                      <h4 className="text-green">🔧 {req.serviceType}</h4>
                      <span className="time-badge green-badge">Accepted</span>
                    </div>
                    <p><strong>Vehicle:</strong> {req.vehicleId ? `${req.vehicleId.make} ${req.vehicleId.model} (${req.vehicleId.licensePlate})` : 'Details Missing'}</p>
                    
                    <button 
                      className="map-btn" 
                      onClick={() => {
                        const lng = req.breakdownLocation.coordinates[0];
                        const lat = req.breakdownLocation.coordinates[1];
                        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                      }}
                    >
                      📍 Navigate to Customer
                    </button>

                    <button 
                      className="save-btn full-width mt-10" 
                      onClick={() => handleCompleteRequest(req._id)}
                    >
                      ✅ Mark as Completed
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      <hr className="divider" />
     
      {/* --- SERVICE HISTORY SECTION (For Both Customer & Mechanic) --- */}
      <div className="history-section">
        <h3 className="section-title">📜 Service History</h3>
        {history.length === 0 ? (
          <p className="empty-text">No past records found.</p>
        ) : (
          <ul className="history-list">
            {history.map(record => (
              <li key={record._id} className="history-item">
                <div>
                  <strong className="history-title">{record.serviceType}</strong> <br/>
                  <span className="history-subtitle">
                    {record.vehicleId ? `${record.vehicleId.make} ${record.vehicleId.model}` : 'Vehicle Info Missing'} • {new Date(record.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="status-completed">
                  ✅ Completed
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;