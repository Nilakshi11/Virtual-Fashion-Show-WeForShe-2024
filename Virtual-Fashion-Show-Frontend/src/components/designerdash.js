import React from 'react';
import './designerdash.css';
import { FaHome, FaUser, FaTshirt, FaBox, FaComments} from 'react-icons/fa';
import myntraLogo from './myntra-logo.png';
import DesignRegistration from './uploaddesign';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <nav className="dashboard-menu">
        <div className="logo-container">
          <img src={myntraLogo} alt="Myntra Logo" className="logo" />
        </div>
        <ul>
          <li><a href="#home"><FaHome /> Home</a></li>
          <li><a href="#products"><FaBox/>Upload</a></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <DesignRegistration />
      </div>
    </div>
  );
}

export default Dashboard;
