'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as faceapi from 'face-api.js';
import Swal from 'sweetalert2'
const SearchBarPopup = ({ isVisible, onClose }) => {
  return (
    <div className={`search-popup ${isVisible ? 'show' : ''}`}>
      <div className="search-popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <input type="text" placeholder="search bar" />
        <input type="text" placeholder="#tag" />
        <input type="text" placeholder="#tag" />
        <button className="search-button">Search</button>
      </div>
    </div>
  );
};

function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalScanVisible, setModalScanVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);

  const descriptors = useRef([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const theme = useMemo(() => localStorage.getItem('theme'), []);

  useEffect(() => {
    if (!sessionStorage.getItem('logged_in')) {
      window.location.href = '/login';
    }

    if (theme) {
      const newDarkMode = theme === 'dark';
      setDarkMode(newDarkMode);
      document.body.classList.toggle('dark-mode', newDarkMode);
    }

    if (sessionStorage.getItem('pfp') === 'null') {
      setModalScanVisible(true);
    }

  }, [theme]);

  useEffect(() => {
    const loadModelsAndDescriptors = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ]);

        const response = await fetch('/descriptors/descriptors.json');
        const data = await response.json();
        descriptors.current = data.map(d => ({
          name: d.name,
          descriptor: new Float32Array(Object.values(d.descriptor)),
        }));
        setLoadingModels(false);
      } catch (err) {
        console.error('Error loading models or descriptors:', err);
        toast.error('Error loading face data or models. Please contact support.');
      }
    };

    loadModelsAndDescriptors();
  }, []);

  const handleFaceScan = useCallback(async () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        toast.error('Video or canvas element not found.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      video.srcObject = stream;

      const labeledFaceDescriptors = descriptors.current.map(
        d => new faceapi.LabeledFaceDescriptors(d.name, [d.descriptor])
      );
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);

      const onPlay = async () => {
        if (video.paused || video.ended) return setTimeout(() => onPlay());

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 }))
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const bestMatch = faceMatcher.findBestMatch(resizedDetections[0].descriptor);

          if (bestMatch.label !== 'unknown') {
            const response = await fetch(`https://api.pgteamsite.tech/api/v2/getstudata/${bestMatch.label}`);
            const data = await response.json();
            const { first_name, last_name, nickname } = data;
            const confirmNickname = await Swal.fire({
              title: 'ยืนยันตัวตน',
              text: `คุณใช่ ${first_name} ${last_name} ใช่หรือไม่?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            });
            if (confirmNickname.isConfirmed) {
              toast.success(`ยินดีต้อนรับคุณ ${nickname}`);

              // get user data in db
              const userResponse = await fetch(`https://api.pgteamsite.tech/api/v2/getuser/${sessionStorage.getItem('id_no')}`);
              const userData = await userResponse.json();



              // update user in db
              const updateResponse = await fetch(`https://api.pgteamsite.tech/api/v2/updateuser/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  id: sessionStorage.getItem('id_no'),
                  first_name: first_name,
                  last_name: last_name,
                  nickname: nickname,
                  username: userData.username,
                  lost : userData.lost,
                  found : userData.found,
                  pfp: 'https://mas.acr.ac.th/mas.school/photo/' + bestMatch.label + '.jpg',
                  stuid: bestMatch.label,
                }),
              });
              const updateData = await updateResponse.json();
              // console.log(updateData);
              sessionStorage.setItem('pfp', 'https://mas.acr.ac.th/mas.school/photo/' + bestMatch.label + '.jpg');
              
              setModalScanVisible(false);
              stream.getTracks().forEach(track => track.stop()); // Stop the camera stream
              return;
            } else {
              setModalScanVisible(false);
              stream.getTracks().forEach(track => track.stop()); // Stop the camera stream
              toast.error('โปรดสแกนใบหน้าอีกครั้ง');
              
              // reload the page in 2 seconds
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
         
            
            return;
          }
        }

        requestAnimationFrame(onPlay);
      };

      video.addEventListener('play', onPlay);
    } catch (error) {
      toast.error('ไม่สามารถเข้าถึงกล้องได้');
      console.error('Error accessing webcam:', error);
    }
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const toggleScanModal = () => {
    setModalScanVisible(!modalScanVisible);
  };
  const handleDarkModeChange = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    toast.success(newDarkMode ? 'Dark mode activated!' : 'Light mode activated!');
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api.pgteamsite.tech/api/v2/getuser/${sessionStorage.getItem('id_no')}`);
      const data = await response.json();
      // console.log(data);
      
      const { username ,first_name, last_name, nickname, lost, found, pfp , stuid} = data;
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('first_name', first_name);
      sessionStorage.setItem('last_name', last_name);
      sessionStorage.setItem('nickname', nickname);
      sessionStorage.setItem('pfp', pfp);
      sessionStorage.setItem('lost', lost);
      sessionStorage.setItem('found', found);
      sessionStorage.setItem('stuid', stuid);
      

    };
    fetchData();
  }, []);

  // real-time check for lost and found
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`https://api.pgteamsite.tech/api/v2/getuser/${sessionStorage.getItem('id_no')}`);
      const data = await response.json();
      const { lost, found } = data;
      
      sessionStorage.setItem('lost', lost);
      sessionStorage.setItem('found', found);
    }, 10000);
    return () => clearInterval(interval);
  }, []);



  // LEADERBOARD

  // TOP LOSTIE order by lost
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.pgteamsite.tech/api/v2/leaderboard/lost');
      const data = await response.json();
      const topLostie = data.slice(0, 3);
      const topLostieList = document.querySelector('.top-lostie-list');
      topLostieList.innerHTML = '';
      topLostie.forEach(lostie => {
        const lostieDiv = document.createElement('div');
        lostieDiv.classList.add('lostie');
        lostieDiv.innerHTML = `
          <img src="https://mas.acr.ac.th/mas.school/photo/${lostie.stuid}.jpg" alt="Profile" />
          <p>${lostie.nickname}</p>
        `;
        topLostieList.appendChild(lostieDiv);
      });
    };
    fetchData();
  }, []);

  // TOP FOUNDIE order by found

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.pgteamsite.tech/api/v2/leaderboard/found');
      const data = await response.json();
      const topFoundie = data.slice(0, 3);
      const topFoundieList = document.querySelector('.top-foundie-list');
      topFoundieList.innerHTML = '';
      topFoundie.forEach(foundie => {
        const foundieDiv = document.createElement('div');
        foundieDiv.classList.add('foundie');
        foundieDiv.innerHTML = `
          <img src="https://mas.acr.ac.th/mas.school/photo/${foundie.stuid}.jpg" alt="Profile" />
          <p>${foundie.nickname}</p>
        `;
        topFoundieList.appendChild(foundieDiv);
      });
    };
    fetchData();
  }, []);

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="header">
        <h1>FINDEE</h1>
        <div className="search-bar">
          <input type="text" placeholder="search bar" />
          <input type="text" placeholder="#tag" />
          <input type="text" placeholder="#tag" />
        </div>
        <button className="setting-button" onClick={toggleModal}>☰</button>
      </header>
      <main className="main">
        <section className="top-lostie">
          <h2 className={`${darkMode ? 'dark-mode' : 'light-mode'}`}>TOP LOSTIE</h2>
          <div className="top-lostie-list">
            <div className="lostie">
              <img src="profile_placeholder.png" alt="Profile" />
              <p>NAME</p>
            </div>
            <div className="lostie">
              <img src="profile_placeholder.png" alt="Profile" />
              <p>NAME</p>
            </div>
            <div className="lostie">
              <img src="profile_placeholder.png" alt="Profile" />
              <p>NAME</p>
            </div>
          </div>
        </section>
        <section className="top-foundie">
          <h2 className={`${darkMode ? 'dark-mode' : 'light-mode'}`}>TOP FOUNDIE</h2>
          <div className="top-foundie-list">
            <div className="foundie">
              <img src="profile_placeholder.png" alt="Profile" />
              <p>NAME</p>
            </div>
            <div className="foundie">
              <img src="profile_placeholder.png" alt="Profile" />
              <p>NAME</p>
            </div>
            <div className="foundie">
              <img src="profile_placeholder.png" alt="Profile" />
              <p>NAME</p>
            </div>
          </div>
        </section>
       
      </main>
      <div className={`modal ${modalVisible ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={toggleModal}>&times;</span>
          {/* Profile  */}
          <h2 className="settings-header">Profile</h2>
          {/* top right Profile pic */}
          <div className="settings-option">
            <label>Profile Picture</label>
            <img src={sessionStorage.getItem('pfp')} alt="Profile" className="profile-pic" />

          </div>
          <div className="settings-option">
            <label>Username</label>
            <input type="text" value={sessionStorage.getItem('username')} disabled />
          </div>
          <div className="settings-option">
            <label>First Name</label>
            <input type="text" value={sessionStorage.getItem('first_name')} disabled />
          </div>
          <div className="settings-option">
            <label>Last Name</label>
            <input type="text" value={sessionStorage.getItem('last_name')} disabled />
          </div>
          <div className="settings-option">
            <label>Nickname</label>
            <input type="text" value={sessionStorage.getItem('nickname')} disabled />
          </div>
          <div className="settings-option">
            <label>Student ID</label>
            <input type="text" value={sessionStorage.getItem('stuid')} disabled />
          </div>
          
          <h2 className="settings-header">Settings</h2>
          <div className="settings-option">
            <label>Dark/Light Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeChange}
            />
          </div>
          <button className="save-settings" onClick={toggleModal}>Save Settings</button>
        </div>
      </div>
      <div className={`modal ${modalScanVisible ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={toggleScanModal}>&times;</span>
          <h2 className="settings-header"> แสกนใบหน้ายืนยันตัวตน</h2>
          {loadingModels ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : (
            <div>
              <div>
                <video ref={videoRef} id="video" width="720" height="560" autoPlay muted />
                <canvas ref={canvasRef} id="canvas"></canvas>
                <button className='scan-btt' onClick={handleFaceScan}>กดเพื่อเริ่มสแกน</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;



const styles = `
.profile-pic {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
}
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    color: #333;
}
body.light-mode {
    background-color: #f5f5f5;
    // color: #333;
}

body.dark-mode {
    background-color: #333;
    // color: #f5f5f5;
}
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    // background-color: #f5f5f5;
}
.scan-btt {
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.3s;
}
.scan-btt:hover {
  transform: scale(1.05);
  background-color: #004494;
  transition: background-color 0.3s;
}



.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
}

.header h1 {
    font-size: 2rem;
    font-weight: bold;
}

.search-bar {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: wrap;
  padding: inherit;
}

.search-bar input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
}

.setting-button {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
}

.main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    flex-grow: 1;
}

section {
    width: 100%;
    max-width: 800px;
    text-align: center;
}

section h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #0056b3;
    border-bottom: 2px solid #0056b3;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}

section h2.dark-mode {
    color: #0cf;  
    border-bottom: 2px solid #0cf;
}


.top-lostie-list, .top-foundie-list {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
}

.lostie, .foundie {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.lostie:hover, .foundie:hover {
    transform: scale(1.05);
}

.lostie img, .foundie img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
}

.lostie p, .foundie p {
    margin: 0;
    font-size: 1rem;
}

.post-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.post img {
    width: 100%;
    max-width: 500px;
    object-fit: cover;
}



/* Modal styles */
.modal {
    display: none; 
    position: fixed; 
    z-index: 1000; 
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4); 
    padding-top: 60px;
}

.modal.show {
    display: block;
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%; 
    max-width: 500px;
    border-radius: 10px;
    position: relative;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    position: absolute;
    right: 20px;
    top: 20px;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.settings-header {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
}

.settings-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
}

.settings-option label {
    font-size: 1.1rem;
}

.settings-option input[type="checkbox"] {
    transform: scale(1.5);
}

button.save-settings {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background-color: #0056b3;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.3s;
}

button.save-settings:hover {
    background-color: #004494;
}

`


export const addStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
};

addStyles();
