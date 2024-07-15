import React from 'react';
import { useNavigate } from 'react-router-dom';
import './userdash.css';
import { FaHome, FaUser, FaTshirt, FaBox, FaHeart, FaShoppingBag, FaChild, FaSearch } from 'react-icons/fa';
import myntraLogo from './myntra-logo.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLiveClick = () => {
    navigate('/liveshow');
  };

  return (
    <div className="dashboard" style={{ marginLeft: '-470px', marginRight: '-470px' }}>
      <nav className="dashboard-menu">
        <div className="logo-container">
          <img src={myntraLogo} alt="Myntra Logo" className="logo" />
        </div>
        <ul>
          <li><a href="#Men"><FaHome /> Men</a></li>
          <li><a href="#Women"><FaTshirt /> Women</a></li>
          <li><a href="#Kids"><FaChild /> Kids</a></li>
          <li><a href="#Home&Living"><FaBox /> Home&Living</a></li>
          <button type="button" className="button" onClick={handleLiveClick}>Live!</button>
        </ul>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-bar" />
          {/* <FaSearch /> */}
        </div>
        <ul>
          <li><a href="#profile"> Profile<FaUser /></a></li>
          <li><a href="#wish"> Wishlist<FaHeart /></a></li>
          {/* <li><a href="#bag"><FaShoppingBag /> Bag</a></li> */}
        </ul>
      </nav>
      <div className="dashboard-content">
        <h1>Welcome to Myntra!</h1>
        {/* <LiveShow /> */}
      </div>
    </div>
  );
};

export default Dashboard;
