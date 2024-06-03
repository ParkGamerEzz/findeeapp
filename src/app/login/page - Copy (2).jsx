'use client'
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from './1.png'; // Import your image

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef(null);  // References for autoFocus
  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ... (Your existing login logic)
    } catch (error) {
      // ... (Error handling)
    }
  };

  return (
    <div className="box">
      <div className="login-page">
        <div className="overlap-group">
          <div className="login" />
          <img className="element" alt="Element" src="1.png" />
          <div className="rectangle" />
          <img className="img" alt="Rectangle" src="rectangle-5.png" />
          <div className="div" />
          <div className="text-wrapper">FINDEE | LOGIN</div>
          <div className="text-wrapper-2">SIGN UP</div>
          <div className="rectangle-2" />
          <div className="text-wrapper-3">USERNAME</div>
          <div className="text-wrapper-4">PASSWORD</div>
          <div className="rectangle-3" />
          <div className="text-wrapper-5">LOGIN</div>
        </div>
      </div>
   

      <ToastContainer />
    </div>
  );
}
 
// ... (Your CSS styles remain the same)


export default Login;

// CSS styles
const styles = `
.box {
  height: 1080px;
  width: 1920px;
}

.box .login-page {
  height: 1080px;
  left: 0;
  position: fixed;
  top: 0;
  width: 1930px;
}

.box .overlap-group {
  height: 1160px;
  left: -40px;
  position: relative;
  top: -40px;
  width: 2000px;
}

.box .login {
  background-color: #ffffff;
  height: 1035px;
  left: 129px;
  position: absolute;
  top: 73px;
  width: 1541px;
}

.box .element {
  height: 1160px;
  left: 0;
  object-fit: cover;
  position: absolute;
  top: 0;
  width: 2000px;
}

.box .rectangle {
  background-color: #ffffff4c;
  border: 10px solid;
  border-color: #ffffff1a;
  border-radius: 61px;
  height: 848px;
  left: 151px;
  position: absolute;
  top: 167px;
  width: 1496px;
}

.box .img {
  height: 56px;
  left: 348px;
  position: absolute;
  top: 503px;
  width: 445px;
}

.box .div {
  border: 3px solid;
  border-color: #ffffff;
  border-radius: 31px;
  height: 57px;
  left: 346px;
  position: absolute;
  top: 617px;
  width: 445px;
}

.box .text-wrapper {
  color: #ffffff;
  font-family: "Roboto-Bold", Helvetica;
  font-size: 64px;
  font-weight: 700;
  left: 264px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  text-align: center;
  text-shadow: 8px 8px 10px #000000b2;
  top: 336px;
  white-space: nowrap;
  width: 610px;
}

.box .text-wrapper-2 {
  color: #ffffff;
  font-family: "Roboto-Light", Helvetica;
  font-size: 32px;
  font-weight: 300;
  left: 264px;
  letter-spacing: 0;
  line-height: 37.5px;
  position: absolute;
  text-align: center;
  text-shadow: 8px 8px 10px #000000b2;
  top: 831px;
  width: 610px;
}

.box .rectangle-2 {
  background: linear-gradient(180deg, rgb(106.25, 174.68, 255) 0%, rgb(144.2, 62.16, 248.63) 100%);
  border-radius: 61px;
  box-shadow: 0px 4px 4px #00000040;
  height: 848px;
  left: 1188px;
  position: absolute;
  top: 167px;
  width: 459px;
}

.box .text-wrapper-3 {
  color: #ffffff;
  font-family: "Roboto-Regular", Helvetica;
  font-size: 28px;
  font-weight: 400;
  left: 367px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 465px;
  white-space: nowrap;
  width: 202px;
}

.box .text-wrapper-4 {
  color: #ffffff;
  font-family: "Roboto-Regular", Helvetica;
  font-size: 28px;
  font-weight: 400;
  left: 367px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 579px;
  white-space: nowrap;
  width: 201px;
}

.box .rectangle-3 {
  background: linear-gradient(180deg, rgb(109, 168, 255) 0%, rgb(144, 66, 249) 100%);
  border: 5px solid;
  border-color: #ffffff80;
  border-radius: 61px;
  height: 66px;
  left: 346px;
  position: absolute;
  top: 746px;
  width: 445px;
}

.box .text-wrapper-5 {
  color: #ffffff;
  font-family: "Roboto-Bold", Helvetica;
  font-size: 38px;
  font-weight: 700;
  left: 477px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  text-align: center;
  top: 756px;
  width: 185px;
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
