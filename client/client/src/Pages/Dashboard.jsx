import React, { useState, useEffect } from "react";
import CraneLocation from "./Crane";
import Attendance from "./Attendance";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import Swal from "sweetalert2"
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
  const [isCompleted, setIsCompleted] = useState(false)

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

const [tomorrow,setTomorrow]= useState("")
  // Shift rotation logic
  const calculateShift = (group) => {
    const startDate = new Date("2025-01-01"); // Example start of rotation
    const currentDate = new Date();
    const tomorrowDate = new Date();
setTomorrow(tomorrowDate.setDate(currentDate.getDate() + 1))

    const daysSinceStart = Math.floor(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    const rotation = daysSinceStart % 7; // 6-day cycle

    let shift;
    if (group === 'A') {
        if (rotation === 0 || rotation === 1) {
            shift = { current: "Morning", next: "Evening" };
        } else if (rotation === 2 || rotation === 3) {
            shift = { current: "Evening", next: "Off" };
        } else if(rotation === 4 || rotation === 5){
            shift = { current: "Off", next: "Morning" };
        } else {
          shift = { current: "Morning", next: "Evening" };
      }
    } else if (group === 'B') {
        if (rotation === 0 || rotation === 1) {
            shift = { current: "Evening", next: "Off" };
        } else if (rotation === 2 || rotation === 3) {
            shift = { current: "Off", next: "Morning" };
        } else if(rotation === 4 || rotation === 5) {
            shift = { current: "Morning", next: "Evening" };
        }else {
            shift = { current: "Evening", next: "Off" };
        }
    } else if (group === 'C') {
      if (rotation === 0 || rotation === 1) {
          shift = { current: "Off", next: "Morning" };
      } else if (rotation === 2 || rotation === 3) {
          shift = { current: "Morning", next: "Evening" };
      } else if (rotation === 4 || rotation === 5) {
          shift = { current: "Evening", next: "Off" };
      } else {
          shift = { current: "Off", next: "Morning" };
      }
  }

    return shift;
};

axios.defaults.withCredentials = true

  useEffect(() => {
    const shift = calculateShift("A");
    setCurrentShift(shift.current);
    setNextShift(shift.next);
  }, []);

  const handleRadioInput = (e) => {
    setRadioNumber(e.target.value);
  };

  const handleLxcInput = (e) => {
    setLxcNumber(e.target.value);
  };

  const handleStartShift = async() => {
    try{
      axios.defaults.withCredentials = true
    if (currentShift === "Off") {
      alert("You are off duty today. Enjoy your day off!");
      return;
    }
    if (isCompleted===true){
        Swal.fire({
          title: "Shift already completed",
          icon: "warning",
          timer: 3000
        })
        return
    }
    
    if (!radioNumber || !lxcNumber) {
      Swal.fire({
        title: "Please enter both Radio and LXC numbers",
        icon: "warning",
        timer: 3000
      })
      return;
    }
    const response= await axios.post("api/shift/start-shift",{lxcNumber,radioNumber,currentShift})
    console.log(response.data)
   
    setShiftStarted(true);
    setRadioAssigned(true);
    setLxcAssigned(true);
    startLocationTracking();
}catch(error){
  console.log(error)
}

  };

  const startLocationTracking = () => {
    navigator.geolocation.watchPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  const handleSignOut = async() => {
    if (!shiftStarted) {
      alert("Shift has not started yet!");
      return;
    }
    try{
      const response = await axios.post("/api/shift/end-shift")
    

      if(response.status===200){
   
    setShiftStarted(false);
    setRadioNumber("");
    setLxcNumber("");
    setRadioAssigned(false);
    setLxcAssigned(false);
    navigate("/");

    return
      }
      console.log(error)

  }catch(error){
     console.log(error)
  }
  };

  useEffect(()=>{
      const getShift = async () =>{
        try{
       const response=await axios.get("api/shift/check-shift")

       console.log(response)
        if(response.data==="Shift has started today."){
          console.log(response.data)
          setShiftStarted(true)
        }else if(response.status===201){
          setShiftStarted(false)
          console.log("new")
          setIsCompleted(true)
        }
      }catch(error){
        console.log(error)
      }
    }
    getShift() 
  },[])

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user}</h2>
      <div className="shift-details">
        <h3>Today&rsquo;s Shift: {currentShift}</h3>
        <h4>Next Shift: {nextShift}</h4>   <h4>{tomorrow}</h4>

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

        {isCompleted && <button style={{padding:"6px",cursor:"not-allowed" ,marginTop:"20px"}}>Today's shift completed</button>}

        <div style={{display:`${isCompleted===false ? "flex" : "none"}`}}>
        <button
          onClick={handleStartShift}
          className="start-shift-btn"
          disabled={currentShift === "Off" || shiftStarted || (radioAssigned && lxcAssigned)}
        >
          {currentShift === "Off" ? "No Shift Today" : "Start Shift"}
        </button>

        

        <button
          onClick={handleSignOut}
          className="sign-out-btn"
          disabled={!shiftStarted}
        >
          Sign Out
        </button>
        </div>


        {shiftStarted && location && (
          <div className="location-tracking">
            <p>
              Current Crane Location: {location.latitude}, {location.longitude}
            </p>
            <CraneLocation location={location} />
          </div>
        )}
      </div>
      <Attendance />
    </div>
  );
}

export default Dashboard;
