import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Sci-fi styled Navbar CSS
import '../PlanetList.css'; // PlanetList CSS

const Navbar = ({ planetList, handlePlanetClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <button className="dropdown-btn" onClick={toggleDropdown}>Planets</button>
        <Link to="/Auth">Login</Link>
      </nav>

      {showDropdown && (
        <div className="planet-list-container">
          <h3>Planet List</h3>
          <ul>
            {planetList.map((item) => (
              <li
                key={item.id}
                style={{ cursor: 'pointer' }}
                onClick={() => handlePlanetClick(item.planet)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
