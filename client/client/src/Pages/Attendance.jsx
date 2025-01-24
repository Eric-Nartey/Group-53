import React from "react";
import "../Styles/Attendance.css";

function Attendance() {
  return (
    <div className="attendance">
      <h3>Attendance Record</h3>
      <ul>
        <li>2025-01-20: Shift Completed</li>
        <li>2025-01-21: Shift Completed</li>
        <li>2025-01-22: Shift Missed</li>
      </ul>
    </div>
  );
}

export default Attendance;
