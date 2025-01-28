import React from 'react'
import Navbar from "../Components/Navbar";
import Dashboard from "../Pages/Dashboard";
import {  Routes, Route } from "react-router-dom";

const WorkerLayout = () => {
  return (
    <div>
        <Navbar />
        <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
    </div>
  )
}

export default WorkerLayout