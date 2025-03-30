import React, { useState, useEffect,useRef } from 'react';
import axios from "../api/api";
import Swal from 'sweetalert2'
import { Layout,Select, Menu, Button, Table, Tabs, Modal, Input, Card, Typography, Space, message } from "antd";
import { UserOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
import '../Styles/AdminDashboard.css';
import {useNavigate} from 'react-router-dom'

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ fullname:'', email: '', password:'',role:'',group:'' });
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
    
    const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isLxcModalOpen, setLxcModalOpen] = useState(false);
  const [isRadioModalOpen, setRadioModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

    axios.defaults.withCredentials= true
    
  // Fetch the login users name on every page refresh
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


    //Toggle Add user pop up
    function toggleAddUser(){
        setIsOpen(!isOpen)
    }
    function toggleAddLXC(){
        setIsOpen1(!isOpen1)
    }

    function toggleAddRadio(){
        setIsOpen2(!isOpen2)
    }


    // fetch attendance data
    const fetchAttendance = async () => {
        try{
        const response = await axios.get('/api/attendance');
        setAttendance(response.data);
        console.log(response.data)
        }catch(error){
            console.log(error)
        }
    };
    
    // fetch all user information
    const getAllusers = async () => {
        try{
            const response = await axios.get('/api/users/get-all-users');
            setUsers(response.data)
            console.log(response.data)
        }catch(error){
            console.log(error)
        }
        };

    // Function to get all LXE only executes when it is called
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


    // Function to get all radio only executes when it is called
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

    // Fetch all the data once the page is refreshed
    useEffect(()=>{
        getLxc()
        getRadio()
        getAllusers()
        fetchAttendance()
    },[])


    //function to add a new radio
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


    //Function to add a new LXE
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


    // Finction to add a new user
    const handleAddUser = async () => {
        try{
        const response = await axios.post('/api/users/signup', newUser);
        if(response.status===200){
            message.success("New user added!");
         }else{
            message.error("Error adding user !")
         }
        
        setNewUser({ name: '', email: '', password: '' });
        }catch(error){
            if(error.response.status===400 || error.response.status===404){
                message.error("User already exist!")
            }else{
            message.error("Error adding user !");
            console.log(error)
            }  
        }
    };

    

    // Function to handle clicks outside of popups and close them
const handleClickOutside = (event) => {
    // Check if the click happened outside popupRef and close the popup
    if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
    }
    // Check if the click happened outside popupRef1 and close the popup
    if (popupRef1.current && !popupRef1.current.contains(event.target)) {
        setIsOpen1(false);
    }
    // Check if the click happened outside popupRef2 and close the popup
    if (popupRef2.current && !popupRef2.current.contains(event.target)) {
        setIsOpen2(false);
    }
};

useEffect(() => {
    // Add event listener to detect mouse clicks anywhere in the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener when component unmounts
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []); // Empty dependency array ensures this runs only once when component mounts


    return (
        <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", padding: "0 20px" }}>
          <Title level={3} style={{ color: "white", margin: 0 }}>Attendance System</Title>
          <Space>
            <Text style={{ color: "white" }}>{user}</Text>
            <Button shape="circle" icon={<UserOutlined />} />
            <Button icon={<LogoutOutlined />} danger>Logout</Button>
          </Space>
        </Header>
  
        <Layout>
          <Sider width={200} className="side" style={{ background: "#fff" }}>
            <Menu mode="inline" selectedKeys={[activeTab]} className="side" onClick={(e) => setActiveTab(e.key)}>
              <Menu.Item key="1">Attendance</Menu.Item>
              <Menu.Item key="2">Users</Menu.Item>
              <Menu.Item key="3">Radio</Menu.Item>
              <Menu.Item key="4">LXC</Menu.Item>
            </Menu>
          </Sider>
  
          <Layout style={{ padding: "24px" }}>
            <Content>
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Attendance" key="1">
                  <Table dataSource={attendance} columns={[{ title: "Name", dataIndex: "userId.fullname" }, { title: "Session", dataIndex: "shiftType" }, { title: "Sign in", dataIndex: "sign_in_time" }, { title: "Sign out", dataIndex: "sign_out_time" }]} />
                </TabPane>
                <TabPane tab="Users" key="2">
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setUserModalOpen(true)}>Add User</Button>
                  <Table dataSource={users} columns={[{ title: "Name", dataIndex: "fullname" }, { title: "Email", dataIndex: "email" }, { title: "Role", dataIndex: "role" }]} />
                </TabPane>
                <TabPane tab="Radio" key="3">
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setRadioModalOpen(true)}>Add Radio</Button>
                  <Table dataSource={radio} columns={[{ title: "Radio Number", dataIndex: "radio_number" }]} />
                </TabPane>
                <TabPane tab="LXC" key="4">
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setLxcModalOpen(true)}>Add LXC</Button>
                  <Table dataSource={lxc} columns={[{ title: "LXC Number", dataIndex: "lxc_number" }]} />
                </TabPane>
              </Tabs>
            </Content>
          </Layout>
        </Layout>
  
        {/* Add User Modal */}
        <Modal title="Add User" visible={isUserModalOpen} onCancel={() => setUserModalOpen(false)} footer={null}>
  <Input placeholder="Name" type="text" value={newUser.fullname} onChange={(e) => setNewUser({...newUser,fullname:e.target.value})} style={{ marginBottom: 10 }} />
  <Input placeholder="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser,email:e.target.value})} style={{ marginBottom: 10 }} />
  <Input placeholder="Password" type="password" value={newUser.password} onChange={(e) =>  setNewUser({...newUser,password:e.target.value})} style={{ marginBottom: 10 }} />

  <Select placeholder="Select Role" value={newUser.role} onChange={(value) => setNewUser({ ...newUser, role: value })} style={{ width: '100%', marginBottom: 10 }}>
    <Select.Option value="Supervisor" >Supervisor</Select.Option>
    <Select.Option value="Admin">Admin</Select.Option>
    <Select.Option value="Lasher">Lasher</Select.Option>
    <Select.Option value="Clerk">Clerk</Select.Option>
    <Select.Option value="Worker">Worker</Select.Option>
  </Select>

  <Select placeholder="Select Group" value={newUser.group} onChange={(value) => setNewUser({ ...newUser, group: value })} style={{ width: '100%', marginBottom: 10 }}>
    <Select.Option value="Group A">Group A</Select.Option>
    <Select.Option value="Group B">Group B</Select.Option>
    <Select.Option value="Group C">Group C</Select.Option>
  </Select>

  <Button type="primary" block onClick={handleAddUser}>Add User</Button>
</Modal>

  
        {/* Add LXC Modal */}
        <Modal title="Add LXC" visible={isLxcModalOpen} onCancel={() => setLxcModalOpen(false)} footer={null}>
          <Input placeholder="LXC Number" value={newLxc} onChange={(e)=> setNewLxc(e.target.value)} style={{ marginBottom: 10 }} />
          <Button type="primary" block onClick={postLxc}>>Add LXC</Button>
        </Modal>
  
        {/* Add Radio Modal */}
        <Modal title="Add Radio" visible={isRadioModalOpen} onCancel={() => setRadioModalOpen(false)} footer={null}>
          <Input placeholder="Radio Number" value={newRadio} onChange={(e)=> setNewRadio(e.target.value)} style={{ marginBottom: 10 }} />
          <Button type="primary" block onClick={postRadio}>Add Radio</Button>
        </Modal>
      </Layout>
    );
};

export default AdminDashboard;