import React, { useState, useEffect } from "react";
import CraneLocation from "./Crane";

import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import Swal from "sweetalert2"
import { Card, Input, Button, Typography, Space, Alert,message } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

const { Title, Text } = Typography;
import "../Styles/Dashboard.css";

function Dashboard( ) {
  const [shiftStarted, setShiftStarted] = useState(false);
  
  const [currentShift, setCurrentShift] = useState("");
  const [nextShift, setNextShift] = useState("");
  const [radioNumber, setRadioNumber] = useState("");
  const [lxeNumber, setLxeNumber] = useState("");
  const [radioAssigned, setRadioAssigned] = useState(false);
  const [lxcAssigned, setLxcAssigned] = useState(false);
  const [user, setUser] = useState("")
  const [group, setGroup] = useState("")
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


  const getGroup = async () => {
    
    try {
       const response= await axios.get("/api/users/get_group",{
        withCredentials: true,
      });
       return response.data
       
      
      } catch (error) {
        console.error("Error fetching group:", error.response?.data || error.message);
        return null; // Ensure function always returns something
      }
  };

  


const [tomorrow,setTomorrow]= useState("")
  // Shift rotation logic
  const calculateShift = async() => {
    const startDate = new Date("2025-01-01"); // Example start of rotation
    const currentDate = new Date();
    const tomorrowDate = new Date();
setTomorrow(tomorrowDate.setDate(currentDate.getDate() + 1))
try{
let group=await getGroup()
console.log("ur group",group)

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

}catch(error){
  console.log(error)
}
};

axios.defaults.withCredentials = true

  useEffect(() => {
     
      
    calculateShift()
    .then(data=> {
      setCurrentShift(data.current)
      setNextShift(data.next)
    })
    .catch(err=> console.log(err))
    
  
    
  }, []);

  const handleRadioInput = (e) => {
    setRadioNumber(e.target.value);
  };

  const handleLxcInput = (e) => {
    setLxeNumber(e.target.value);
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
    
    if (!radioNumber) {
      Swal.fire({
        title: "Please enter both Radio and LXC numbers",
        icon: "warning",
        timer: 3000
      })
      return;
    }
    const response= await axios.post("api/shift/start-shift",{lxeNumber,radioNumber,location: location.placeName,currentShift})
    console.log(response.data)
   
    setShiftStarted(true);
    setRadioAssigned(true);
    setLxcAssigned(true);
    startLocationTracking();
}catch(error){
  if (error.response && error.response.status === 404) {
    message.error(error.response.data?.message || "Resource not found");
  }
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

 


  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    placeName: null,
    error: null,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation((prev) => ({ ...prev, latitude: lat, longitude: lon }));

          // Reverse Geocoding with Mapbox API
          const accessToken = "pk.eyJ1IjoiYWt1YWZvLTEiLCJhIjoiY200MXhxNnJrMDQzNjJrcjAzbXg4cTliMCJ9.6cwG6dff4E2UjnQz7q963A";
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}`
            );
            const data = await response.json();
            if (data.features.length > 0) {
              setLocation((prev) => ({ ...prev, placeName: data.features[0].place_name }));
            } else {
              setLocation((prev) => ({ ...prev, placeName: "Location not found" }));
            }
          } catch (error) {
            setLocation((prev) => ({ ...prev, error: "Failed to fetch location name" }));
          }
        },
        (error) => {
          setLocation((prev) => ({ ...prev, error: error.message }));
        }
      );
    } else {
      setLocation((prev) => ({ ...prev, error: "Geolocation is not supported" }));
    }
  }, []);

  
  
  




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


  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if ((hours === 18 && minutes === 30) || (hours === 7 && minutes === 30) && shiftStarted && currentShift==="Morning" || currentShift==="Evening") { // 6:30 PM
        handleSignOut()
      }
      
    };

    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(()=>{
      const getShift = async () =>{
        try{
       const response= await axios.get("api/shift/check-shift")

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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
     <div>{location.placeName}</div>
      <Card>
        <Title level={3}>Welcome, {user}</Title>
        <Text strong>Today's Shift:</Text> <Text>{currentShift}</Text>
        <br />
        <Text strong>Next Shift:</Text> <Text>{nextShift}</Text>
      </Card>
      
      {currentShift !== "Off" && (
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>Enter Equipment Details</Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              placeholder="Enter Radio Number"
              value={radioNumber}
              onChange={handleRadioInput}
              disabled={shiftStarted}
            />
            <Input
              placeholder="Enter LXE Number"
              value={lxeNumber}
              onChange={handleLxcInput}
              disabled={shiftStarted}
            />
          </Space>
        </Card>
      )}

      {isCompleted ? (
        <Alert
          message="Today's shift completed"
          type="success"
          showIcon
          icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          style={{ marginTop: 20 }}
        />
      ) : (
        <Space style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={handleStartShift}
            disabled={currentShift === "Off" || shiftStarted || (radioAssigned && lxcAssigned)}
          >
            {currentShift === "Off" ? "No Shift Today" : "Start Shift"}
          </Button>
          <Button type="default" danger onClick={handleSignOut} disabled={!shiftStarted}>
            Sign Out
          </Button>
        </Space>
      )}

      {shiftStarted && location && (
        <Card style={{ marginTop: 20 }}>
          <Text strong>Current Crane Location:</Text>
          <Text>
            {location.latitude}, {location.longitude}
          </Text>
          <CraneLocation location={location} />
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
