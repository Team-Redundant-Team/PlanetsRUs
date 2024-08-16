import React from 'react';
import './PlanetDetails.css';

const PlanetDetails = ({ selectedPlanet }) => {
  if (!selectedPlanet) return <div className="planet-details">No planet selected.</div>;

  return (
    <div className="planet-details">
      <h3>{selectedPlanet.name}</h3>
      <p>Type: {selectedPlanet.type}</p>
      <p>Price: <span className="planet-price">${selectedPlanet.price}</span></p>
      <p>Description: {selectedPlanet.description}</p>
      <div className="owned-by">
        <p>Owned by:</p>
        {selectedPlanet.ownedBy.length > 0 ? (
          selectedPlanet.ownedBy.map((owner, index) => <span key={index}>{owner}</span>)
        ) : (
          <span>No owners</span>
        )}
      </div>
      <button className="buy-now-btn">Buy It Now</button>
    </div>
  );
};

export default PlanetDetails;
