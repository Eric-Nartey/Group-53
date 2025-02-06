import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import "./App.css"

import SignupPage from "./Pages/SignUp";
import ForgetPassword from "./Pages/ForgetPassword"
import ResetPassword from "./Pages/ResetPassword"
import AdminLayout from "./Layouts/AdminLayout";
import WorkerLayout from "./Layouts/WorkerLayout";

const App = () => {
  
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget_password"  element={<ForgetPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/*" element={<AdminLayout/>} />
        <Route path="/u/*" element={<WorkerLayout/>} />
      </Routes>


    </Router>
  );
};

export default App;

