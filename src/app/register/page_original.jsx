'use client'
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'

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

    if(formData.username.length < 4){
        toast.error('ชื่อผู้ใช้ต้องไม่ต่ำกว่า 4 ตัวอักษร');
        return
    }
    else if(formData.password.length < 8){
        toast.error('รหัสผ่านต้องไม่ต่ำกว่า 8 ตัวอักษร');
        return
    }
    else if(formData.stuid.length < 5){
        toast.error('รหัสนักศึกษาต้องไม่ต่ำกว่า 5 ตัวอักษร');
        return
    }

    if (formData.password !== formData.cfpassword) {
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
              username: formData.username,
              password: formData.password,
              stuid: formData.stuid
            })
          });
    
          const data = await response.json();
          
          if (data.success) {
            toast.success('สมัครสมาชิคสำเร็จ', 'LOGIN AUTH');
            setTimeout(() => {
              window.location.href = './/';
            }, 1500);
          } else {
            toast.error(data.message || 'เลข ID หรือ รหัสผ่านไม่ถูกต้อง', 'LOGIN AUTH');
          }

    //   if (!data.success) {
    //     toast.error(data.message, 'FINDEE');
    //   } else {
       
    //       toast.success('Registration successful', 'FINDEE');
    //       setTimeout(() => {
    //         window.location.href = 'login.php';
    //       }, 1500);
       
    //   }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด || API OFFLINE')
    }
  };

  return (
    <div>
 
    
    <form className="form" onSubmit={handleSubmit}>
      <div className="control">
        <h1>FINDEE | REGISTER</h1>
      </div>
      <div className="control block-cube block-input">
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
      </div>
      <div className="control block-cube block-input">
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
      </div>
      <div className="control block-cube block-input">
        <input
          name="cfpassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.cfpassword}
          onChange={handleChange}
        />
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
      </div>
      <div className="control block-cube block-input">
        <input
          name="stuid"
          type="text"
          placeholder="Student ID"
          value={formData.stuid}
          onChange={handleChange}
        />
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
      </div>
      <button className="btn block-cube block-cube-hover" type="submit">
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
        <div className="text">Register</div>
      </button>
      <button
        className="btn block-cube block-cube-hover"
        type="button"
        onClick={() => (window.location.href = './/')}
      >
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
        <div className="text">Login</div>
      </button>
      <ToastContainer />

    </form>
    </div>
  );
};

export default Register;

// CSS styles
const styles = `
*,
::after,
::before {
  box-sizing: border-box;
}

html, body {
  min-height: 100%;
  color: #fff;
  
  background: #000000;
  font-family: monospace, serif;
  letter-spacing: 0.05em;
}

h1 {
  font-size: 23px;
}

.form {
  width: 300px;
  padding: 64px 15px 24px;
  margin: 0 auto;
}

.control {
  margin: 0 0 24px;
}

.control input {
  width: 100%;
  padding: 14px 16px;
  border: 0;
  background: transparent;
  color: #fff;
  font-family: monospace, serif;
  letter-spacing: 0.05em;
  font-size: 16px;
}

.control input:hover,
.control input:focus {
  outline: none;
  border: 0;
}

.btn {
  width: 100%;
  display: block;
  padding: 14px 16px;
  background: transparent;
  outline: none;
  border: 0;
  color: #fff;
  letter-spacing: 0.1em;
  font-weight: bold;
  font-family: monospace;
  font-size: 16px;
}

.block-cube {
  position: relative;
}

.block-cube .bg-top {
  position: absolute;
  height: 10px;
  background: rgb(2, 0, 36);
  background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(52, 9, 121, 1) 37%, rgba(0, 212, 255, 1) 94%);
  bottom: 100%;
  left: 5px;
  right: -5px;
  transform: skew(-45deg, 0);
  margin: 0;
}

.block-cube .bg-top .bg-inner {
  bottom: 0;
}

.block-cube .bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgb(2, 0, 36);
  background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(52, 9, 121, 1) 37%, rgba(0, 212, 255, 1) 94%);
}

.block-cube .bg-right {
  position: absolute;
  background: rgb(2, 0, 36);
  background: rgba(0, 212, 255, 1);
  top: -5px;
  z-index: 0;
  bottom: 5px;
  width: 10px;
  left: 100%;
  transform: skew(0, -45deg);
}

.block-cube .bg-right .bg-inner {
  left: 0;
}

.block-cube .bg .bg-inner {
  transition: all 0.2s ease-in-out;
}

.block-cube .bg-inner {
  background: #212121;
  position: absolute;
  left: 2px;
  top: 2px;
  right: 2px;
  bottom: 2px;
}

.block-cube .text {
  position: relative;
  z-index: 2;
}

.block-cube.block-input input {
  position: relative;
  z-index: 2;
}

.block-cube.block-input input:focus ~ .bg-right .bg-inner,
.block-cube.block-input input:focus ~ .bg-top .bg-inner,
.block-cube.block-input input:focus ~ .bg-inner .bg-inner {
  top: 100%;
  background: rgba(255, 255, 255, 0.5);
}

.block-cube.block-input .bg-top,
.block-cube.block-input .bg-right,
.block-cube.block-input .bg {
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.2s ease-in-out;
}

.block-cube.block-input .bg-right .bg-inner,
.block-cube.block-input .bg-top .bg-inner {
  transition: all 0.2s ease-in-out;
}

.block-cube.block-input:focus,
.block-cube.block-input:hover {
  .block-cube.block-input .bg-top,
  .block-cube.block-input .bg-right,
  .block-cube.block-input .bg {
    background: rgba(255, 255, 255, 0.8);
  }
}

.block-cube.block-cube-hover:focus,
.block-cube.block-cube-hover:hover {
  .block-cube .bg .bg-inner {
    top: 100%;
  }
}

.credits {
  position: fixed;  
  left: 0;
  bottom: 0;
  padding: 15px 15px;
  width: 100%;
  z-index: 111;
}

.credits a {
  opacity: 0.6;
  color: #fff;
  font-size: 11px;
  text-decoration: none;
}

.credits a:hover {
  opacity: 1;
}
`;

export const addStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
};
addStyles();
