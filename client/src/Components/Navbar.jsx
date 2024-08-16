import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Make sure this is linked correctly

const Navbar = ({ planetList, handlePlanetClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = (event) => {
    event.preventDefault();
    setShowDropdown(!showDropdown);
    console.log('Dropdown toggled:', !showDropdown);
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
    </div>
  );
};

export default Navbar;
