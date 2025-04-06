
import AdminDashboard from "../Pages/AdminDashboard";
import {  Routes, Route } from "react-router-dom";
import AttendanceReport from '../Pages/Report';

const AdminLayout = () => {
  return (
    <div>
       
        <Routes>
        <Route path="/Admindashboard" element={<AdminDashboard/>} />
        <Route path='/reports' element={<AttendanceReport />} />
        </Routes>
    </div>
  )
}

export default AdminLayout