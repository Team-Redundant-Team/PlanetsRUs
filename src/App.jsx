import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SolarSystem from './SolarSystem';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navabar from './Components/Navbar2'



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

const App = () => {
  const mountRef = useRef(null);
  const [planetList, setPlanetList] = useState([]); 
  const [planetCounter, setPlanetCounter] = useState(0); 
  const [followPlanet, setFollowPlanet] = useState(null);  
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const solarSystemsRef = useRef([]);
  const originalColorsRef = useRef(new Map()); // To store original colors of planets


  const createStarryBackground = (scene) => {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const starVertices = [];
  
    const voidZoneRadius = 500; // Define the radius of the void zone
  
    for (let i = 0; i < 10000; i++) { // Create 10,000 stars
      let x, y, z;
      let distanceFromCenter;
  
      do {
        x = THREE.MathUtils.randFloatSpread(2000); // Random position in -1000 to 1000
        y = THREE.MathUtils.randFloatSpread(2000);
        z = THREE.MathUtils.randFloatSpread(2000);
  
        // Calculate the distance from the center
        distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
      } while (distanceFromCenter < voidZoneRadius); // Exclude stars within the void zone
  
      starVertices.push(x, y, z);
    }
  
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars); // Add stars to the scene
  };
  

  const createRandomSolarSystems = (scene) => {
    const numberOfSolarSystems = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
    let localCounter = planetCounter; // Start with the current global counter value
    const newPlanetList = []; // Consolidated list for all new planets

    for (let i = 0; i < numberOfSolarSystems; i++) {
      const solarSystem = new SolarSystem(scene, `Solar System ${i + 1}`, solarSystemsRef.current);

      const numberOfPlanets = Math.floor(Math.random() * 6); // Random number of planets per solar system
      console.log(numberOfPlanets);

      for (let j = 0; j < numberOfPlanets; j++) {
        const planetSize = Math.random() * 2.5 + 0.5; // Random planet size between 0.5 and 2
        const planetColor = 0xffffff; // Random color
        const distanceFromStar = 10 + j * 5; // Increase distance to space out planets more
        
        const planet = solarSystem.addPlanet(planetSize, planetColor, distanceFromStar);
        planet.scale.set(planetSize, planetSize, planetSize); //ensures equal scaling on xyz for lookAt() in tjs.

        // Store the original color of the planet
        originalColorsRef.current.set(planet.uuid, planet.material.color.clone());

        // Generate a unique ID combining the solar system and planet index
        const uniqueId = planet.uuid;
        newPlanetList.push({ id: uniqueId, name: `Planet ${localCounter}`, planet });
        localCounter += 1; // Increment the local counter after each planet creation
      }

      // Add the newly created solar system to the list
      solarSystemsRef.current.push(solarSystem);
    }

    // Update the global planet list state with the consolidated new planets
    setPlanetList((prevList) => [...prevList, ...newPlanetList]);

    // Persist the incremented counter globally for future runs
    setPlanetCounter(localCounter);
  };
  
  camera.position.z = 100; //inital pos for the camera
  
  useEffect(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .25;
    controls.enableZoom = true; // Disable OrbitControls zoom to manage it manually

    sceneRef.current = scene;
    cameraRef.current = camera;

    createStarryBackground(scene);

    const animate = () => {
      requestAnimationFrame(animate);

      solarSystemsRef.current.forEach((solarSystem) => {
        solarSystem.getPlanets().forEach((planet) => {
          const axis = planet.userData.rotationAxis;
          const quaternion = new THREE.Quaternion();
          const speed = 0.0002;

          quaternion.setFromAxisAngle(axis, speed);
          planet.position.applyQuaternion(quaternion);

          if (followPlanet && followPlanet.uuid === planet.uuid) {
            const direction = new THREE.Vector3(0, 0, 5).applyQuaternion(camera.quaternion);
            const offset = direction.multiplyScalar(8); //constant distance instead of zoomDistance

            
            cameraRef.current.lookAt(followPlanet.position.x, followPlanet.position.y, followPlanet.position.z);
            camera.position.copy(planet.position).add(offset);


            // console.log("Camera position:", camera.position);
            // console.log("Camera is looking at:", planet.position);
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
      renderer.dispose(); // Dispose of the WebGL context
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [followPlanet]); // Include followPlanet and zoomDistance as dependencies for old code

  
  const handlePlanetClick = (planet) => {
    if (!planet) {
        console.error("Attempted to follow an undefined planet.");
        return;
    }
    

    // console.log('PLANET UUID', planet.uuid);
    // setFollowPlanet(planet.uuid);
    // Reset color of the previous planet
    console.log('follow planet:', followPlanet);
    if (followPlanet && originalColorsRef.current.has(followPlanet.uuid)) { //followplanet is the planet that a user clicks and is set by the useState.(it should not be null on first click)
      console.log('ORIGINAL COLOR REF:', originalColorsRef.current);
        followPlanet.material.color.copy(originalColorsRef.current.get(followPlanet.uuid));
    }

    // // Change the color of the selected planet to bright pink
    // planet.material.color.set(0xff00ff);

    // // // Scale the planet to make it more visible
    // planet.scale.set(10, 10, 10);

    // turned off for debugging - need this functionality later
    // // Set the camera position relative to the planet
    // const offset = new THREE.Vector3(0, 100, 100);  // Offset from the planet
    // cameraRef.current.position.copy(planet.position).add(offset);
    // cameraRef.current.lookAt(planet.position);

    // Ensure the camera follows this planet
    console.log('PLANET:', planet)
    setFollowPlanet(planet);

    setTimeout(() => {
      console.log('UPDATED FOLLOWPLANET:', followPlanet);
    }, 0);
};


const stopFollowingPlanet = () => {
  setFollowPlanet(null); // Stop following the planet
};


  return (
    
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button onClick={() => createRandomSolarSystems(sceneRef.current)} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Add Solar System
      </button>
      <button onClick={stopFollowingPlanet} style={{ position: 'absolute', top: '10px', left: '150px' }}>
        Stop Following
      </button>
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '100px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <h3>Planet List</h3>
        <ul>
          {planetList.map((item) => (
            <li 
              key={item.id}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                console.log('ITEM:', item)
                handlePlanetClick(item.planet)}

              } 
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
    
  );
};

export default App;
