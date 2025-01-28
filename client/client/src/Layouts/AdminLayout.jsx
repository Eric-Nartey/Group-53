import React from 'react'
import AdminDashboard from "../Pages/AdminDashboard";
import {  Routes, Route } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
       
        <Routes>
        <Route path="/Admindashboard" element={<AdminDashboard/>} />
        </Routes>
    </div>
  )
}

export default AdminLayout