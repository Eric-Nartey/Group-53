import React,{lazy,Suspense} from 'react'
import Navbar from "../Components/Navbar";
const Dashboard = lazy(()=> import("../Pages/Dashboard")) ;
import {  Routes, Route } from "react-router-dom";
import LoadingSpinner from '../Components/LoadingSpinner';
const Attendance = lazy(()=> import( '../Pages/Attendance'));

const WorkerLayout = () => {
  return (
    <div>
        <Navbar />
        <Routes>
        <Route path="/dashboard" element={<Suspense fallback={<LoadingSpinner />}><Dashboard/></Suspense>} />
        <Route path="/attendance-records" element={<Suspense fallback={<LoadingSpinner />}><Attendance /></Suspense>} />
        </Routes>
    </div>
  )
}

export default WorkerLayout