'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.pgteamsite.tech/api/v2/login', { username, password });
      const { success, message, data } = response.data;
      // console.log(response.data)
      if (success) {
        toast.success('เข้าสู่ระบบสำเร็จ', 'LOGIN AUTH');
        setTimeout(() => {
          window.location.href = '../home';
        }, 1500);

        // Assuming you handle session logic in your backend and this will set cookies or similar
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('pfp', data.pfp);
        sessionStorage.setItem('id_no', data.id);
        sessionStorage.setItem('logged_in', true);
      } else {
        toast.error(message || 'เลข ID หรือ รหัสผ่านไม่ถูกต้อง', 'LOGIN AUTH');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด || API OFFLINE');
    }
  };


  return (
    <div >
      <form className="form" autoComplete="off" onSubmit={handleLogin}>
        <div className="control">
          <h1>FINDEE | LOGIN</h1>
        </div>
        <div className="control block-cube block-input">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <div className="text">Log In</div>
        </button>
        <button className="btn block-cube block-cube-hover" type="button" onClick={() => window.location.href = 'register'}>
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
      </form>
      <ToastContainer />

    </div>
  );
}

export default Login;

// CSS styles
const styles = `
*,
::after,
::before {
  box-sizing: border-box;
}

html, body {
  min-height: 100%;
  color: #FFFFFF;
  background: #000000;
  

  font-family: monospace, serif;
  letter-spacing: 0.05em;
}

h1 {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif,Arial, Helvetica, sans-serif;
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

// Add this
