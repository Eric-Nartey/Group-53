import React, { useState, useEffect,useRef } from 'react';
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
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen1, setIsOpen1] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [lxc,setLxc] = useState([])
    const [radio,setRadio] = useState([])
    const [user,setUser]=useState("")
    const popupRef = useRef(null);
    const popupRef1 = useRef(null);
    const popupRef2 = useRef(null);
    


    axios.defaults.withCredentials= true
    

    useEffect(()=>{

        const getUsername = async () => {
          
          try {
             const response= await axios.get("/api/users/me");
             setUser(response.data)
             console.log(response.data)
            
          } catch (error) {
           
            console.log(error)
          }
        };
        getUsername()
      },[])

    function toggleAddUser(){
        setIsOpen(!isOpen)
    }
    function toggleAddLXC(){
        setIsOpen1(!isOpen1)
    }

    function toggleAddRadio(){
        setIsOpen2(!isOpen2)
    }

    const fetchAttendance = async () => {
        try{
        const response = await axios.get('/api/attendance');
        setAttendance(response.data);
        console.log(response.data)
        }catch(error){
            console.log(error)
        }
    };

    const getAllusers = async () => {
        try{
            const response = await axios.get('/api/users/get-all-users');
            setUsers(response.data)
            console.log(response.data)
        }catch(error){
            console.log(error)
        }
        };


    const navigate = useNavigate()
    const getLxc = async () => {
    try{
        const response = await axios.get('/api/lxcRadio/get-lxcs');
        setLxc(response.data)
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

    useEffect(()=>{
        getLxc()
        getRadio()
        getAllusers()
        fetchAttendance()
    },[])

    const postRadio = async () => {
        try{
        const response= await axios.post('/api/lxcRadio/post-radio',{radioNumber:newRadio});
        const Data= response.data.data;
        setRadio(prevData => [...Data,...prevData])
        console.log(response.data)
        
        }catch(error){
            console.log(error)
        }
    };

    const postLxc = async () => {
        try{
        const response=await axios.post('/api/lxcRadio/post-lxc',{lxcNumber:newLxc});
         
         const Data=response.data.data
         setLxc(prevData => [...Data,...prevData])
        }catch(error){
            console.log(error)
        }
    };

    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = async () => {
        await axios.post('/api/users', newUser);
        
        setNewUser({ name: '', email: '', password: '' });
    };

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (label) => {
        setActiveTab(label);
    };

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        if (popupRef1.current && !popupRef1.current.contains(event.target)) {
            setIsOpen1(false);
        }
        if (popupRef2.current && !popupRef2.current.contains(event.target)) {
            setIsOpen2(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="admin-dashboard">

<nav className="navbar">
      <h1 style={{color:"white"}}>Attendance System</h1>
      <section style={{display:"flex",gap:"5px"}}>
      <p style={{color:"white"}}>{user}</p>
      <button style={{height:"30px",width:"30px",background:"transparent",borderRadius:"50%",color:"#ddd",border:"2px solid #ddd"}}>{user[0]}</button>
      </section>
    </nav>
            <h1>Admin Dashboard</h1>
           
           <div className='flex-container'>
            <div className='flex-button'>
                <button onClick={toggleAddUser}>Add user</button>
                <button onClick={toggleAddLXC}>Add LXC</button>
                <button onClick={toggleAddRadio}>Add Radio</button>
            </div>

            <div className='flex-button2'>
    <button className={`tab-button ${activeTab === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>Attendance</button>
    <button className={`tab-button ${activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>Users</button>
    <button className={`tab-button ${activeTab === 2 ? 'active' : ''}`} onClick={() => handleTabClick(2)}>Radio</button>
    <button className={`tab-button ${activeTab === 3 ? 'active' : ''}`} onClick={() => handleTabClick(3)}>LXC</button>
</div>
            </div>
            
            <div className='pop-cover' style={{display:`${isOpen ? "block" :"none"}`}}>
            <div className="add-user" ref={popupRef} >
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
            </div>
            
            <div className='pop-cover' style={{display:`${isOpen1 ? "block" :"none"}`}}>
            <div className="add-user " ref={popupRef1}>
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
            </div>


            <div className='pop-cover' style={{display:`${isOpen2 ? "block" :"none"}`}}>
            <div className="add-user"  ref={popupRef2}>
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
            </div>


            {activeTab=== 0 && (<div className="attendance-list">
                <h2>Attendance</h2>
                <table className="users-table">
        <thead>  {/*Table head */}
            <tr className='bg-gray-100 '>
                <th className="user-th">Name</th>
                <th className="user-th">Session</th>
                <th className="user-th">Sign in</th>
                <th className="user-th">Sign out</th>
                
            </tr>
        </thead>
                <tbody>
            {attendance?.map((item) => (
                <tr key={item._id}  className='users-tr'>
                    <td className="users-td">{item?.userId?.fullname}</td>
                    <td className="users-td">{item?.shiftType}</td>
                    <td className="users-td">{item?.sign_in_time}</td>
                    <td className="users-td">{item?.sign_out_time}</td>
                        
                </tr>
             ))}
                    
                </tbody>
                </table>
            </div>)}

            {activeTab=== 1 && (<div className="users-list">
                <h2>Users</h2>
                
                <table className="users-table">
        <thead>  {/*Table head */}
            <tr className='bg-gray-100 '>
                <th className="user-th">Name</th>
                <th className="user-th">Email</th>
                <th className="user-th">Role</th>
                
            </tr>
        </thead>
        <tbody>
            {users?.map((user) => (
                <tr key={user._id}  className='users-tr'>
                    <td className="users-td">{user?.fullname}</td>
                    <td className="users-td">{user?.email}</td>
                    <td className="users-td">{user?.role}</td>
                        
                </tr>
             ))}
                    
                </tbody>
                </table>
            </div>)}

            

            {activeTab=== 2 && (<div className="attendance-list">
                <h2>Radios</h2>
                <ul>
                    {radio?.map((record) => (
                        <li key={record._id}>{record?._id} - {record?.radio_number}</li>
                    ))}
                </ul>
            </div>)}

            {activeTab=== 3 && (<div className="attendance-list">
                <h2>LXC's</h2>
                <ul>
                    {lxc?.map((record) => (
                        <li key={record._id}>{record.lxc_number} </li>
                    ))}
                </ul>
            </div>)}
        </div>
    );
};

export default AdminDashboard;