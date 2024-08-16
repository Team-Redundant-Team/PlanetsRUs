import React from 'react';
import './PlanetDetails.css';

const PlanetDetails = ({ selectedPlanet }) => {
  if (!selectedPlanet) {
    return <div className="planet-details">Select a planet to see details</div>;
  }

  return (
    <div className="planet-details">
      <h3>{selectedPlanet.name}</h3>
      <p>Type: {selectedPlanet.type}</p>
      <p>Price: {selectedPlanet.price}</p>
      <p>Description: {selectedPlanet.description}</p>
      <div className="owned-by">
        <p>Owned by:</p>
        {selectedPlanet.ownedBy.length > 0 ? (
          selectedPlanet.ownedBy.map((owner, index) => <span key={index}>{owner}</span>)
        ) : (
          <span>No owners</span>
        )}
      </div>
    </div>
  );
};

export default PlanetDetails;
