'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/style.css'; // Import the global styles

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.pgteamsite.tech/api/v2/login', { username, password });
      const { success, message, data } = response.data;
      if (success) {
        toast.success('เข้าสู่ระบบสำเร็จ', { toastId: 'LOGIN AUTH' });
        setTimeout(() => {
          window.location.href = '../home';
        }, 1500);

        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('pfp', data.pfp);
        sessionStorage.setItem('id_no', data.id);
        sessionStorage.setItem('logged_in', 'true');
      } else {
        toast.error(message || 'เลข ID หรือ รหัสผ่านไม่ถูกต้อง', { toastId: 'LOGIN AUTH' });
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด || API OFFLINE');
    }
  };

  return (
    <div className="container">
      <div className="box-bg">
        <div className="box">
          <div className="rec">
            <h1 className="header">FINDEE | LOGIN</h1>
            <form onSubmit={handleLogin} className="form-in">
              <div>
                <p className="test">USERNAME</p>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  className="datainput" 
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className="test">PASSWORD</p>
                <input 
                  type="password" 
                  name="password" 
                  id="pwd" 
                  className="datainput" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="sub-btn">LOGIN</button>
              
            </form>
            <div className="sign-up">
                <a  href="/register"><button className="sub-btn">SIGN UP</button></a>
              </div>
            <div className="left-box"></div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
