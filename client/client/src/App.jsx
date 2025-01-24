import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import "./App.css"

const App = () => {
  const user = { username: "John Doe" }; // Mock user data
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard user={user}/>} />
      </Routes>
    </Router>
  );
};

export default App;

