import  { useState, useEffect } from "react";
import { Table, Card } from "antd";
import { startOfWeek, format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "../api/api"



const AttendanceDashboard = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // Fetch attendance records from API
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get("/api/attendance/get-attendance", { withCredentials: true });
      setData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  }
    fetchAttendanceData()
  },[])
   // Dummy Data - Replace with API Fetch

 
   const signInCount = data.length; // <-- Declare before using
 

   const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0); // Reset time to midnight
    return d.toISOString().split("T")[0]; // Return in YYYY-MM-DD format
};

const weeklyAttendance = data.reduce((acc, entry) => {
    if (!entry.sign_in_time) return acc; // Skip if no sign-in time

    const weekStart = getWeekStart(entry.sign_in_time);
    const formattedWeek = `Week of ${new Date(weekStart).toDateString().slice(4, 10)}`; // Example: "Mar 25"

    // Initialize week if not already present
    if (!acc[formattedWeek]) {
        acc[formattedWeek] = { signIn: 0, dates: [] };
    }

    // Increment sign-in count
    acc[formattedWeek].signIn += 1;

    // Store formatted sign-in date (e.g., "Mar 25")
    acc[formattedWeek].dates.push(new Date(entry.sign_in_time).toDateString().slice(4, 10));

    return acc;
}, {});

// Convert to array format for the chart
const chartData = Object.entries(weeklyAttendance).map(([week, data]) => ({
    week,
    signIn: data.signIn,
    dates: [...new Set(data.dates)], // Remove duplicate dates
}));


// Sort the weeks in correct order
chartData.sort((a, b) => {
  const weekNumberA = parseInt(a.week.match(/\d+/)[0], 10);
  const weekNumberB = parseInt(b.week.match(/\d+/)[0], 10);
  return weekNumberA - weekNumberB;
});

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { week, dates } = payload[0].payload;
    return (
      <div style={{
        backgroundColor: "white",
        padding: "8px",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
        borderRadius: "6px",
      }}>
        <p className="font-semibold">{week}</p>
        <p className="text-gray-600">Sign-ins: {payload[0].value}</p>
        <p className="text-sm text-gray-500">
          Dates: {dates.join(", ")}
        </p>
      </div>
    );
  }
  return null;
};



  // Table Columns
  const columns = [
    { 
      title: "Date", 
      dataIndex: "sign_in_time", 
      key: "date", 
      render: (text) => new Date(text).toLocaleDateString("en-US", { month: "short", day: "numeric" }) 
    },
    { title: "Shift Type", dataIndex: "shiftType", key: "shiftType" },
    { 
      title: "LXE", 
      dataIndex: "Lxe_id", 
      key: "Lxe_id",
      render: (Lxe_id) => Lxe_id?.lxe_number || "N/A" 
    },
    { 
      title: "Radio", 
      dataIndex: "radio_id", 
      key: "radio_id",
      render: (radio_id) => radio_id?.radio_number || "N/A"
    },
    { 
      title: "Location", 
      dataIndex: "location", 
      key: "location",
      render: (text) => text || "N/A"
    },
    { 
      title: "Shift", 
      dataIndex: "shift", 
      key: "shift",
      render: (text) => text || "N/A"
    },
    { 
      title: "Sign-in Time", 
      dataIndex: "sign_in_time", 
      key: "signIn",
      render: (text) => new Date(text).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    },
    { 
      title: "Sign-out Time", 
      dataIndex: "sign_out_time", 
      key: "signOut",
      render: (text) => text ? new Date(text).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "N/A"
    }
  ];
  

  return (
    <div >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600",width:"fit-content", color: "#2563EB",marginTop:"40px",marginInline:"auto", marginBottom: "1rem" }}>Attendance Dashboard</h2>

      {/* Sign-in Count */}
      <Card className="mb-6 p-4 shadow-lg">
        <h3 className="text-lg font-medium">Total Sign-ins This Month: <span className="text-blue-500">{signInCount}</span></h3>
      </Card>

      {/* Attendance Table */}
      <Card className="mb-6 p-4 shadow-lg">
        <h3 className="text-lg font-medium mb-3">Attendance Records</h3>
        
        <Table dataSource={data} columns={columns} scroll={{ x: 'max-content' }}  pagination={{ pageSize: 5 }} rowKey={(record, index) => index} />
        
      </Card>

      {/* Attendance Chart */}
      <Card className="p-4 shadow-lg">
  <h3 className="text-lg font-medium mb-3">Weekly Attendance Trend</h3>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={chartData}>
      <XAxis dataKey="week" />
      <YAxis allowDecimals={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="signIn" fill="#1890ff" barSize={40} />
    </BarChart>
  </ResponsiveContainer>
</Card>
    </div>
  );
};

export default AttendanceDashboard;
