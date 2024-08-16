import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ planetList, handlePlanetClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = (event) => {
    event.preventDefault();
    setShowDropdown(!showDropdown);
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <button className="dropdown-btn" onClick={toggleDropdown}>Planets</button>
        <Link to="/auth">Login</Link>
      </nav>

      <div className={`planet-list-container ${showDropdown ? 'show' : ''}`}>
        <ul className="planet-list">
          {planetList.map((item) => (
            <li
              key={item.id}
              onClick={() => handlePlanetClick(item)}
            >
              {item.name} <span className='planet-price'>${item.price}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Audio Component */}
      <audio id="background-audio" controls autoPlay loop className="audio-player">
        <source src="/universe_sound.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Navbar;
