import React, { useEffect, useState } from 'react';
import { DatePicker, Table, Row, Col, Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../api/api'; // Adjust the import path as necessary

import moment from 'moment';

const AttendanceReport = () => {
  const [reportData, setReportData] = useState({
    lateSignIns: [],
    missingSignOuts: [],
    usageStats: { LXE: [], Radio: [] },
  });
  const [selectedMonth, setSelectedMonth] = useState('3'); // Default March
  const [selectedYear, setSelectedYear] = useState('2025');

   axios.defaults.withCredentials = true
  const fetchReportData = async () => {
    if (!selectedMonth || !selectedYear) return;
    console.log('Fetching report data for:', selectedMonth, selectedYear); // Log the selected month and year
    const response = await axios.get(`/api/attendance/report?month=${selectedMonth}&year=${selectedYear}`);
    const data = response.data;
    console.log('Report Data:', data); // Log the response data

    if (response.status === 200) {
      setReportData(data); // ✅ works fine
    } else {
      message.error('Failed to fetch report data'); 
      console.error('Failed to fetch report data:', data);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, selectedYear]);

  const handleDateChange = (date) => {
    setSelectedMonth(date.format('MM'));
    setSelectedYear(date.format('YYYY'));
  };

  // Helper function to generate separate bar chart data for LXE and Radio
  const getLxeBarChartData = () => {
    return reportData.usageStats.LXE || [];
  };

  const getRadioBarChartData = () => {
    return reportData.usageStats.Radio || [];
  };

  const lateSignInColumns = [
    {
      title: 'Name',
      dataIndex: 'userId',
      key: 'fullname',
      render: (user) => user?.fullname || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'userId',
      key: 'email',
      render: (user) => user?.email || 'N/A',
    },
    { title: 'Shift', dataIndex: 'shiftType', key: 'shiftType' },
    { title: 'Sign-In Time', dataIndex: 'sign_in_time', key: 'sign_in_time', render: (text) => moment(text).format('MMM YYYY hh:mm A') }, // Format sign-in time
    { title: 'Sign-Out Time', dataIndex: 'sign_out_time', key: 'sign_out_time', render: (text) => text ? moment(text).format('MMM YYYY hh:mm A') : 'N/A' }, // Format sign-out time
    { title: 'Location', dataIndex: 'location', key: 'location' },
  ];

  return (
    <div style={{ padding: '20px' }}>
    <section style={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2>Attendance Report</h2>
      <Row gutter={16} style={{ width: "150px", height: "50px", alignItems: 'center' }}>
  <Col span={24}>
    <DatePicker
      style={{ height: '100%', width: '100%', padding: '8px' }} // height boost here
      value={moment(`${selectedYear}-${selectedMonth}`, 'YYYY-MM')}
      onChange={handleDateChange}
      picker="month"
      format="YYYY-MM"
    />
  </Col>
</Row>

      </section>

      {reportData ? (
        <>
          {/* Bar chart for LXE usage */}
          <div style={{ marginTop: '20px', height: 400 }}>
            <h3>LXE Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getLxeBarChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="LXE" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart for Radio usage */}
          <div style={{ marginTop: '20px', height: 400 }}>
            <h3>Radio Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRadioBarChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Radio" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Late Sign-Ins</h3>
            <Table dataSource={reportData?.lateSignIns || []} scroll={{ x: 'max-content' }} columns={lateSignInColumns} rowKey="_id" />
          </div>
        </>
      ) : (
        <Spin size="large" />
      )}
    </div>
  );
};

export default AttendanceReport;
