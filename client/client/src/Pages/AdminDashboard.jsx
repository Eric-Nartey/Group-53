import React, { useState, useEffect } from 'react';
import axios from "../api/api";
import Swal from 'sweetalert2'
import '../Styles/AdminDashboard.css';
import {useNavigate} from 'react-router-dom'

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ fullname: '', email: '', password:'' });
    const [newRadio, setNewRadio] = useState("");
    const [newLxc, setNewLxc] = useState("");
    const [attendance, setAttendance] = useState([]);

    
    axios.defaults.withCredentials= true
    const fetchUsers = async () => {
        const response = await axios.get('/api/users');
        setUsers(response.data);
    };

    const fetchAttendance = async () => {
        const response = await axios.get('/api/users/attendance');
        setAttendance(response.data);
    };


    const navigate = useNavigate()
    const getLxc = async () => {
    try{
        const response = await axios.get('/api/lxcRadio/get-lxcs');
        
        console.log(response.data)
    }catch(error){
        console.log(error)
    }
    };

    const getRadio = async () => {
        try{
        const response = await axios.get('/api/lxcRadio/get-radios');
        console.log(response.data)
        }catch(error){
            console.log(error)
            if(error.status===405){
                Swal.fire({
                    title:"You're not authorized to view this page",
                    icon:"error",
                    timer:3000
                })
                navigate(-1);
                return
            }
        }
    };

    const postRadio = async () => {
        try{
        const response= await axios.post('/api/lxcRadio/post-radio',{radioNumber:newRadio});
        console.log(response.data)
        }catch(error){
            console.log(error)
        }
    };

    const postLxc = async () => {
        try{
        const response=await axios.post('/api/lxcRadio/post-lxc',{lxcNumber:newLxc});
         console.log(response.data)
        }catch(error){
            console.log(error)
        }
    };

    useEffect(()=>{
        getLxc()
        getRadio()
    },[])
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = async () => {
        await axios.post('/api/users', newUser);
        fetchUsers();
        setNewUser({ name: '', email: '', password: '' });
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="add-user">
                <h2>Add User</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddUser}>Add User</button>
            </div>

            <div className="add-user">
                <h2>Add Lxc</h2>
              
                <input
                    type="text"
                    name="lxc"
                    placeholder="LXC"
                    value={newLxc}
                    onChange={(e) => setNewLxc(e.target.value)}
                />
                
                <button onClick={postLxc}>Add User</button>
            </div>

            <div className="add-user">
                <h2>Add Radio</h2>
               
               
                <input
                    type="text"
                    name="radioNumber"
                    placeholder="Radio Number"
                    value={newRadio}
                    onChange={(e) => setNewRadio(e.target.value)}
                />
                <button onClick={postRadio}>Add Radio</button>
            </div>

            <div className="users-list">
                <h2>Users</h2>
                <ul>
                    {users?.map((user) => (
                        <li key={user.id}>{user?.name} - {user?.lxc} - {user?.radioNumber}</li>
                    ))}
                </ul>
            </div>
            <div className="attendance-list">
                <h2>Attendance</h2>
                <ul>
                    {attendance?.map((record) => (
                        <li key={record.id}>{record?.userName} - {record?.date}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;