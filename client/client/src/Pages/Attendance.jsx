import React,{useState,useEffect} from "react";
import "../Styles/Attendance.css";
import axios from "../api/api";

function Attendance() {
  const[attendance,setAttendance]=useState([])
  axios.defaults.withCredentials=true
useEffect(()=>{
  const getAttendance = async () => {
    try {
      const response = await axios.get("/api/attendance/get-attendance")
        console.log(response.data)
        setAttendance(response.data)
      
    
    }catch(error){
      console.log(error)
    }
  }
  getAttendance()
},[])


const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
};

  return (
    <div className="attendance">
      <h3>Attendance Record</h3>
      <ul>
      {attendance.map((item,index)=> <li key={index}>{formatDate(item.sign_in_time)}</li>)}
      </ul>
    </div>
  );
}

export default Attendance;
