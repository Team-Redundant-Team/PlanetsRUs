import * as THREE from 'three';
import calculateDistance from './utils';
import { useEffect, useState } from 'react'
export const MIN_DISTANCE = 5; // Minimum allowed distance between objects
const MAX_STAR_DISTANCE = 1000; // Maximum allowed distance between stars

class SolarSystem {
  constructor(scene, name, solarSystems) {
    this.name = name;
    this.planets = [];
    this.scene = scene;
    this.solarSystems = solarSystems || []; // Reference to other solar systems

    // Create the main star
    this.star = this.createStar();
  }

  createStar() {
    const textureLoader = new THREE.TextureLoader();
    const textureIndex = Math.floor(Math.random() * 7) + 1; // Randomly select between sun1.jpg, sun2.jpg, sun3.jpg
    const texturePath = `/textures/sun${textureIndex}.jpg`;
  
    const texture = textureLoader.load(texturePath, 
      (texture) => {
        console.log(`Texture sun${textureIndex} loaded successfully.`);
      },
      undefined, 
      (error) => {
        console.error(`Error loading texture sun${textureIndex}:`, error);
      }
    );
  
    // Create the star material using the loaded texture
    const starMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const starGeometry = new THREE.SphereGeometry(Math.random() * 20 + 15, 32, 32);
    const star = new THREE.Mesh(starGeometry, starMaterial);
  
    let maxAttempts = 100; // Limit the number of attempts to find a valid position
    let positionSet = false;
  
    while (!positionSet && maxAttempts > 0) {
      const position = new THREE.Vector3(
        Math.random() * 400 - 300,  // X position within range
        Math.random() * 400 - 300,  // Y position within range
        Math.random() * 400 - 300   // Z position within range
      );
  
      // Ensure the star is within 1000 units of all other stars
      let withinRange = true;
      for (let otherSystem of this.solarSystems) {
        if (otherSystem && otherSystem.star && otherSystem.star.position) {
          const distance = calculateDistance({ position }, otherSystem.star);
          if (distance > MAX_STAR_DISTANCE) {
            withinRange = false;
            break;
          }
        }
      }
  
      if (withinRange) {
        star.position.copy(position);
        positionSet = true;
      }
  
      maxAttempts--; // Decrement the attempt counter
    }
  
    // If a position wasn't found after the maximum attempts, set a default position
    if (!positionSet) {
      star.position.set(0, 0, 0); // Default position if all attempts fail
      console.warn("Default position set for star due to position constraints.");
    }
  
    this.scene.add(star);
    return star;
  }
  
  
  

  addPlanet(size, color, distance) {
  const textureLoader = new THREE.TextureLoader();
  const textureIndex = Math.floor(Math.random() * 100) + 1;
  const texturePath = `/textures/texture${textureIndex}.gif`;

  let texture = textureLoader.load(texturePath, (texture) => {
    
    console.log(`Texture ${textureIndex} loaded successfully.`);
  },
  undefined, 
  (error) => {
    
    console.error(`Error loading texture ${textureIndex}:`, error);
  }
);

  try {
    texture = textureLoader.load(texturePath);
  } catch (error) {
    console.error("Error loading texture:", error);
  }

  // Apply the texture to the material
  const planetMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);


    // Set initial position for the planet and check for collisions
    let angle = 0;
    let positionSet = false;

    // Generate a random rotation axis
    const rotationAxis = new THREE.Vector3(
      Math.random() * 2 - 1, 
      Math.random() * 2 - 1, 
      Math.random() * 2 - 1
    ).normalize();

    while (!positionSet) {
      const x = this.star.position.x + Math.cos(angle) * distance;
      const z = this.star.position.z + Math.sin(angle) * distance;

      planet.position.set(x, this.star.position.y, z);

      // Check distance with other planets
      let collision = false;
      for (let otherPlanet of this.planets) {
        if (calculateDistance(planet, otherPlanet) < MIN_DISTANCE + size) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        positionSet = true;
      } else {
        // Increment the angle slightly and try again
        angle += Math.PI / 16;
      }
    }

    planet.userData.rotationAxis = rotationAxis; // Store the rotation axis in the planet's user data
    this.planets.push(planet);
    this.scene.add(planet);

    return planet; // Ensure the planet is returned for further use
  }

  getPlanets() {
    return this.planets;
  }
}

export default SolarSystem;
