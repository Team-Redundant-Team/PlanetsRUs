import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SolarSystem from './SolarSystem.jsx';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import PlanetDetails from './Components/PlanetDetails.jsx'; // Import the new component
import axios from 'axios';
import UserAccount  from './Components/UserAccount.jsx';

import PlanetPage from './Components/Planets.jsx';
import Auth from './Components/Auth.jsx';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

const App = () => {
  const mountRef = useRef(null);
  const [planetList, setPlanetList] = useState([]); 
  const [selectedPlanet, setSelectedPlanet] = useState(null);  // For the planet details box
  const [followPlanet, setFollowPlanet] = useState(null);  
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const solarSystemsRef = useRef([]);
  

  const createStarryBackground = (scene) => {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const starVertices = [];
  
    const voidZoneRadius = 500;

    for (let i = 0; i < 10000; i++) {
      let x, y, z;
      let distanceFromCenter;
  
      do {
        x = THREE.MathUtils.randFloatSpread(2000);
        y = THREE.MathUtils.randFloatSpread(2000);
        z = THREE.MathUtils.randFloatSpread(2000);
        distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
      } while (distanceFromCenter < voidZoneRadius);
  
      starVertices.push(x, y, z);
    }
  
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  };

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await axios.get('/api/planets');
        const fetchedPlanets = response.data.map((planet) => ({
          id: planet.id,
          name: planet.name,
          type: planet.type,
          price: planet.price,
          description: planet.description,
          ownedBy: planet.ownedBy || [],  // Assuming the API provides this
        }));
        
        // Only set the planetList once, no need to call it in createSolarSystems
        setPlanetList(fetchedPlanets);
        createSolarSystems(fetchedPlanets);
      } catch (error) {
        console.error('Error fetching planets:', error);
      }
    };
  
    fetchPlanets();
  }, []);
  
  const createSolarSystems = (planets) => {
    const solarSystem = new SolarSystem(scene, `Solar System 1`, solarSystemsRef.current);
  
    planets.forEach((planetData, index) => {
      const planetSize = Math.random() * 2.5 + 0.5;
      const distanceFromStar = 15 + index * 5;
      const planet = solarSystem.addPlanet(planetSize, 0xffffff, distanceFromStar);
      
      planet.userData.planetId = planetData.id;

      planetData.planet = planet;
    });

    solarSystemsRef.current.push(solarSystem);
  };

  camera.position.z = 100;

  useEffect(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .25;
    controls.enableZoom = true;

    sceneRef.current = scene;
    cameraRef.current = camera;

    createStarryBackground(scene);

    const animate = () => {
      requestAnimationFrame(animate);

      solarSystemsRef.current.forEach((solarSystem) => {
        solarSystem.getPlanets().forEach((planet) => {
          const axis = planet.userData.rotationAxis;
          const quaternion = new THREE.Quaternion();
          const speed = 0.0005;

          quaternion.setFromAxisAngle(axis, speed);
          planet.position.applyQuaternion(quaternion);

          const rotationSpeed = 0.001;
          planet.rotation.y += rotationSpeed;

          if (followPlanet && followPlanet.id === planet.userData.planetId) {
            const direction = new THREE.Vector3(0, 0, 10).applyQuaternion(camera.quaternion);
            const offset = direction.multiplyScalar(1);

            cameraRef.current.lookAt(planet.position.x, planet.position.y, planet.position.z);
            camera.position.copy(planet.position).add(offset);
          }
        });
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [followPlanet]);

  const handlePlanetClick = (planet) => {
    if (!planet) {
        console.error("Attempted to follow an undefined planet.");
        return;
    }

    setSelectedPlanet(planet);
    setFollowPlanet(planet);
  };

  

  const stopFollowingPlanet = () => {
    setFollowPlanet(null);
  };

  return (
    <>
    <div className="App">
      <Navbar planetList={planetList} handlePlanetClick={handlePlanetClick} />
  
      <Routes>
        <Route path="/" />
        
        <Route path="/Auth" element={<Auth />} />
        <Route path='/account' element={<UserAccount />} />
      </Routes>
      
    </div>
  
      <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        

        
        <PlanetDetails selectedPlanet={selectedPlanet} />

        
        <div className="planet-list-container">
          <ul className="planet-list">
            {planetList.map((item) => (
              <li
                key={item.id}  // Ensure each item has a unique and consistent key
                style={{ cursor: 'pointer' }}
                onClick={() => handlePlanetClick(item)}  // Set the selected planet details
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default App;
