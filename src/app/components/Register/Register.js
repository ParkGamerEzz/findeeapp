'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import '../styles/style.css'; // Import the global styles

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    cfpassword: '',
    stuid: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, cfpassword, stuid } = formData;

    if (username.length < 4) {
      toast.error('ชื่อผู้ใช้ต้องไม่ต่ำกว่า 4 ตัวอักษร');
      return;
    } else if (password.length < 8) {
      toast.error('รหัสผ่านต้องไม่ต่ำกว่า 8 ตัวอักษร');
      return;
    } else if (stuid.length < 5) {
      toast.error('รหัสนักศึกษาต้องไม่ต่ำกว่า 5 ตัวอักษร');
      return;
    }

    if (password !== cfpassword) {
      toast.error('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await fetch('https://api.pgteamsite.tech/api/v2/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          stuid
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('สมัครสมาชิคสำเร็จ');
        setTimeout(() => {
          window.location.href = './';
        }, 1500);
      } else {
        toast.error(data.message || 'เลข ID หรือ รหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด || API OFFLINE');
    }
  };

  return (
    <div className="container-register">
      <Head>
        <title>Register</title>
      </Head>
      <div className="box-bg">
        <div className="box">
          <div className="rec">
            <h1 className="header">FINDEE | REGISTER</h1>
            <form onSubmit={handleSubmit} className="form-in">
              <div>
                <p className="test">USERNAME</p>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  className="datainput" 
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <p className="test">PASSWORD</p>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  className="datainput" 
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <p className="test">CONFIRM PASSWORD</p>
                <input 
                  type="password" 
                  name="cfpassword" 
                  id="cfpassword" 
                  className="datainput" 
                  placeholder="Confirm Password"
                  value={formData.cfpassword}
                  onChange={handleChange}
                />
                <p className="test">STUDENT ID</p>
                <input 
                  type="text" 
                  name="stuid" 
                  id="stuid" 
                  className="datainput" 
                  placeholder="Student ID"
                  value={formData.stuid}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="sub-btn">REGISTER</button>
            </form>
            <div className="sign-up">
              <a href="/login"><button className="sub-btn">LOGIN</button></a>
            </div>
            <div className="left-box"></div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
