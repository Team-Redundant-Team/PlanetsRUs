import { useState, useEffect } from "react";
import axios from "axios";

const PlanetPage = () => {
  const [planets, setPlanets] = useState([]);  // Initialize with an empty array
  const [error, setError] = useState(null);  // For error handling
  const [loading, setLoading] = useState(true);  // To handle loading state

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await axios.get('/api/planets');
        setPlanets(response.data);  // Set the planets data once received
      } catch (error) {
        console.error('Error fetching planets:', error);
        setError('Failed to load planets.');
      } finally {
        setLoading(false);  // Ensure loading state is set to false after request completes
      }
    };
    fetchPlanets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show a loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>;  // Display error message if request failed
  }

  if (planets.length === 0) {
    return <div>No planets found.</div>;  // Handle case where no planets are returned
  }

  return (
    <ul>
      {planets.map((planet) => (
        <li key={planet.id}>
          {planet.name} - {planet.type} - {planet.price}
        </li>
      ))}
    </ul>
  );
};

export default PlanetPage;
