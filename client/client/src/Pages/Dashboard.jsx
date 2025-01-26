import React, { useState, useEffect } from "react";
import CraneLocation from "./Crane";
import Attendance from "./Attendance";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import "../Styles/Dashboard.css";

function Dashboard( ) {
  const [shiftStarted, setShiftStarted] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentShift, setCurrentShift] = useState("");
  const [nextShift, setNextShift] = useState("");
  const [radioNumber, setRadioNumber] = useState("");
  const [lxcNumber, setLxcNumber] = useState("");
  const [radioAssigned, setRadioAssigned] = useState(false);
  const [lxcAssigned, setLxcAssigned] = useState(false);
  const [user, setUser] = useState("")

  const navigate = useNavigate();


  useEffect(()=>{

  const getUsername = async () => {
    
    try {
       const response= await axios.get("/api/users/me",{
        withCredentials: true,
      });
       setUser(response.data)
      
    } catch (error) {
     
      console.log(error)
    }
  };
  getUsername()
},[])

  // Shift rotation logic
  const calculateShift = () => {
    const startDate = new Date("2025-01-01"); // Example start of rotation
    const currentDate = new Date();
    const daysSinceStart = Math.floor(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    const rotation = daysSinceStart % 6; // 6-day cycle

    if (rotation === 0 || rotation === 1) {
      return { current: "Morning", next: "Evening" };
    } else if (rotation === 2 || rotation === 3) {
      return { current: "Evening", next: "Off" };
    } else {
      return { current: "Off", next: "Morning" };
    }
  };

  useEffect(() => {
    const shift = calculateShift();
    setCurrentShift(shift.current);
    setNextShift(shift.next);
  }, []);

  const handleRadioInput = (e) => {
    setRadioNumber(e.target.value);
  };

  const handleLxcInput = (e) => {
    setLxcNumber(e.target.value);
  };

  const handleStartShift = () => {
    if (currentShift === "Off") {
      alert("You are off duty today. Enjoy your day off!");
      return;
    }
    if (!radioNumber || !lxcNumber) {
      alert("Please input both your radio number and LXC number before starting the shift!");
      return;
    }
    setShiftStarted(true);
    setRadioAssigned(true);
    setLxcAssigned(true);
    startLocationTracking();
  };

  const startLocationTracking = () => {
    navigator.geolocation.watchPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  const handleSignOut = () => {
    if (!shiftStarted) {
      alert("Shift has not started yet!");
      return;
    }
    alert(
      `Shift completed. Radio (${radioNumber}) and LXC (${lxcNumber}) have been signed out.`
    );
    setShiftStarted(false);
    setRadioNumber("");
    setLxcNumber("");
    setRadioAssigned(false);
    setLxcAssigned(false);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user}</h2>
      <div className="shift-details">
        <h3>Today&lsquo;s Shift: {currentShift}</h3>
        <h4>Next Shift: {nextShift}</h4>

        {currentShift !== "Off" && (
          <div>
            <div className="input-section">
              <label htmlFor="radioNumber" className="label">
                Enter Radio Number:
              </label>
              <input
                id="radioNumber"
                type="text"
                value={radioNumber}
                onChange={handleRadioInput}
                className="input"
                disabled={shiftStarted}
              />
            </div>
            <div className="input-section">
              <label htmlFor="lxcNumber" className="label">
                Enter LXC Number:
              </label>
              <input
                id="lxcNumber"
                type="text"
                value={lxcNumber}
                onChange={handleLxcInput}
                className="input"
                disabled={shiftStarted}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleStartShift}
          className="start-shift-btn"
          disabled={currentShift === "Off" || (radioAssigned && lxcAssigned)}
        >
          {currentShift === "Off" ? "No Shift Today" : "Start Shift"}
        </button>

        {shiftStarted && location && (
          <div className="location-tracking">
            <p>
              Current Crane Location: {location.latitude}, {location.longitude}
            </p>
            <CraneLocation location={location} />
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="sign-out-btn"
          disabled={!shiftStarted}
        >
          Sign Out
        </button>
      </div>
      <Attendance />
    </div>
  );
}

export default Dashboard;
