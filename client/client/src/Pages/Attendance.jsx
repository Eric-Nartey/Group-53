import React, { useState, useEffect } from "react";
import { Table, Card } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";




const AttendanceDashboard = () => {
   // Dummy Data - Replace with API Fetch
const attendanceData = [
  { date: "2025-03-01", shiftType: "Morning", lxe: "LXE-101", radio: "Radio-A", signIn: "08:00 AM" },
  { date: "2025-03-05", shiftType: "Evening", lxe: "LXE-102", radio: "Radio-B", signIn: "04:30 PM" },
  { date: "2025-03-10", shiftType: "Morning", lxe: "LXE-103", radio: "Radio-C", signIn: "07:45 AM" },
  { date: "2025-03-15", shiftType: "Evening", lxe: "LXE-101", radio: "Radio-A", signIn: "05:00 PM" },
];
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch attendance records from API
    setData(attendanceData); // Replace with API response
  }, []);

  // Process data for visualization
  const signInCount = data.length;
  const chartData = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    signIn: 1,
  }));

  // Table Columns
  const columns = [
    { title: "Date", dataIndex: "date", key: "date", render: (text) => new Date(text).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
    { title: "Shift Type", dataIndex: "shiftType", key: "shiftType" },
    { title: "LXE", dataIndex: "lxe", key: "lxe" },
    { title: "Radio", dataIndex: "radio", key: "radio" },
    { title: "Sign-in Time", dataIndex: "signIn", key: "signIn" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">Attendance Dashboard</h2>

      {/* Sign-in Count */}
      <Card className="mb-6 p-4 shadow-lg">
        <h3 className="text-lg font-medium">Total Sign-ins This Month: <span className="text-blue-500">{signInCount}</span></h3>
      </Card>

      {/* Attendance Table */}
      <Card className="mb-6 p-4 shadow-lg">
        <h3 className="text-lg font-medium mb-3">Attendance Records</h3>
        <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} rowKey={(record, index) => index} />

      </Card>

      {/* Attendance Chart */}
      <Card className="p-4 shadow-lg">
        <h3 className="text-lg font-medium mb-3">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="signIn" fill="#1890ff" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;
