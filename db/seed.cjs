const client= require('./client.cjs');
const { createUser } = require('./users.cjs');
const { createPlanet } = require('./planets.cjs');
const { createReview } = require('./reviews.cjs');

const dropTables = async() => {
  try{
    await client.query(`
      DROP TABLE IF EXISTS carts_planets;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS planets;
      DROP TABLE IF EXISTS carts;
      `);
  }catch(err) {
    console.log("Couldnt Drop Table", err);
  }
}

const createUsersTable= async() => {
  try {
    await client.query(`
      CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      password VARCHAR(60) NOT NULL,
      email VARCHAR(60) UNIQUE NOT NULL
      );
      `);
  }catch(err) {
    console.log("Could not createUserTable", err);
  }
}

const createReviewsTable= async()=> {
  try{
    await client.query(`
      CREATE TABLE reviews(
      id SERIAL PRIMARY KEY, 
      review TEXT, 
      date DATE DEFAULT CURRENT_DATE,
      planet_id INT,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE
      );
      `);
  }catch(err) {
    console.log("Could not createReviewsTable", err)
  }
}

const createPlanetsTable= async()=> {
  try{
    await client.query(`
      CREATE TABLE planets(
      id SERIAL PRIMARY KEY, 
      name VARCHAR(30) NOT NULL UNIQUE,
      price FLOAT, 
      type VARCHAR(30),
      description TEXT,
      owned_by VARCHAR(30)
      );
      `);
  }catch(err) {
    console.log("Could not createPlanetsTable", err)
  }
}

const createCartsTable= async()=> {
  try{
    await client.query(`
      CREATE TABLE carts(
      id SERIAL PRIMARY KEY, 
      is_open BOOLEAN,
      total BIGINT,
      user_id BIGINT
      );
      `);
  }catch(err) {
    console.log("Could not createCartsTable", err)
  }
}


const createCartsPlanetsTable= async()=> {
  try{
    await client.query(`
      CREATE TABLE carts_planets(
        id SERIAL PRIMARY KEY, 
        cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
        planet_id INT REFERENCES planets(id) ON DELETE CASCADE,
        UNIQUE(cart_id, planet_id)
        );
        `);
      }catch(err) {
        console.log("Could not createReviewsTable", err)
  }
}

const planets = [
  { name: "Zeltron", price: 2500, type: "Gas Giant", description: "A massive planet with swirling clouds of neon gases." },
  { name: "Aqualis", price: 1800, type: "Ocean World", description: "A water-covered planet with an extensive network of deep-sea caverns." },
  { name: "Luminar", price: 3000, type: "Rocky", description: "A planet with crystal formations that glow in the dark." },
  { name: "Kryptos", price: 2200, type: "Ice World", description: "A frozen planet with towering ice peaks and blizzards." },
  { name: "Volcarn", price: 2700, type: "Volcanic", description: "A planet with active volcanoes and rivers of molten lava." },
  { name: "Florania", price: 2000, type: "Forest", description: "A planet covered in thick forests and diverse wildlife." },
  { name: "Nebulon", price: 3500, type: "Gas Giant", description: "A colossal gas giant with vibrant auroras." },
  { name: "Thalassa", price: 2300, type: "Ocean World", description: "A planet with calm, crystal-clear oceans and floating islands." },
  { name: "Pyrros", price: 2600, type: "Volcanic", description: "A fiery planet with constant eruptions and lava flows." },
  { name: "Cryos", price: 2100, type: "Ice World", description: "A frigid planet with vast glaciers and subzero temperatures." },
  { name: "Eldoria", price: 2400, type: "Rocky", description: "A planet rich in rare minerals and gemstone deposits." },
  { name: "Ventara", price: 3200, type: "Gas Giant", description: "A gas giant with violent storms and hurricane-like winds." },
  { name: "Serenia", price: 1900, type: "Forest", description: "A serene planet with lush greenery and peaceful landscapes." },
  { name: "Xyphos", price: 2800, type: "Rocky", description: "A planet with rugged terrain and towering mountain ranges." },
  { name: "Aquilon", price: 1700, type: "Ocean World", description: "A planet with warm, tropical seas and coral reefs." },
  { name: "Frostia", price: 2000, type: "Ice World", description: "A snow-covered planet with frozen tundras and icy plains." },
  { name: "Ignis", price: 2900, type: "Volcanic", description: "A planet with an ever-present red glow from its molten surface." },
  { name: "Verdant", price: 2500, type: "Forest", description: "A planet teeming with life and vibrant plant species." },
  { name: "Aetheria", price: 3300, type: "Gas Giant", description: "A mystical gas giant with ethereal, cloud-like structures." },
  { name: "Riviera", price: 2100, type: "Ocean World", description: "A planet with pristine beaches and turquoise waters." },
  { name: "Granite", price: 2200, type: "Rocky", description: "A planet with vast canyons and stone plateaus." },
  { name: "Cryona", price: 2400, type: "Ice World", description: "A planet with a thin atmosphere and icy deserts." },
  { name: "Pyros", price: 3100, type: "Volcanic", description: "A volatile planet with explosive volcanic activity." },
  { name: "Sylva", price: 2300, type: "Forest", description: "A densely wooded planet with towering ancient trees." },
  { name: "Zephyra", price: 3400, type: "Gas Giant", description: "A gas giant with gentle breezes and soft, pastel clouds." }
];

const seedReviews = [
    { review: "Zeltron boasts a vibrant, green-hued atmosphere due to its rich vegetation and high oxygen levels. Its lush forests and diverse ecosystems make it a paradise for explorers.", planet_id: 1 },
    { review: "Zeltron is enveloped in thick clouds of sulfuric acid, giving it a bright appearance from space. Its surface pressure is about 90 times that of Earth’s.", planet_id:1},
    { review: "Aqualis's diverse climates and ecosystems make it the only known planet to support life. Its surface is a dynamic mix of oceans, land, and atmosphere.", planet_id:2},
    { review: "Kryptos, with its reddish color from iron oxide, has the largest volcano and canyon in the solar system. It’s a prime candidate for human exploration.", planet_id:3},
    { review: "Volcarn’s Great Red Spot is a massive storm that has been raging for centuries. Its strong magnetic field and large size make it a dominant presence in our solar system.", planet_id:4 },
    { review: "Florania's ring system is composed of ice, rock, and dust particles, varying in size from tiny grains to large chunks. Its beauty is unparalleled among the planets.", planet_id:5},
    { review: "Nebulon is unique for its extreme tilt, which causes its poles to experience 42 years of sunlight followed by 42 years of darkness. Its color comes from methane in its atmosphere.", planet_id:6},
    { review: "Thalassa is known for its deep blue color and strong winds, which can reach speeds of over 1,200 miles per hour. It’s the farthest planet from the Sun.", planet_id:7},
    { review: "Pyrros, once considered the thirtieth planet, is now classified as a dwarf planet. Its highly elliptical orbit and icy surface make it a subject of great interest.", planet_id:8},
    { review: "Cryos, located in the asteroid belt, has a surface that includes bright spots likely made of salt deposits. It’s the largest object in the asteroid belt and a dwarf planet.", planet_id:9},
    { review: "Eldoria is the most volcanically active body in the solar system. Its surface is dotted with sulfur and lava flows.", planet_id:10},
    { review: "Ventara is believed to have a subsurface ocean beneath its icy crust, making it a prime candidate in the search for extraterrestrial life.", planet_id:11},
    { review: "Serenia has its own magnetic field and is believed to have a layered structure of ice and rock.", planet_id:12},
    { review: "Xyphos has a heavily cratered surface and is thought to have a subsurface ocean beneath its icy crust.", planet_id:13},
    { review: "Aquilon has a thick atmosphere and lakes of liquid methane and ethane on its surface, making it a fascinating world of its own.", planet_id:14},
    { review: "Frostia has a surface marked by bright streaks and is thought to have a thin ring system of its own.", planet_id:15},
    { review: "Ignis has geysers that eject water vapor and ice particles from its subsurface ocean, hinting at a potentially habitable environment.", planet_id:16},
    { review: "Verdant has a highly varied surface with large canyons and unusual features, making it one of the most geologically diverse moons in the solar system.", planet_id:17},
    { review: "Aetheria orbits the planet in the opposite direction of Neptune's rotation, suggesting it was captured by Neptune’s gravity.", planet_id:18 },
    { review: "Riviera is almost half the size of Xyphos itself and has a surface with striking features such as a large canyon and polar ice caps.", planet_id:19},
    { review: "Granite, a dwarf planet in the Kuiper Belt, is notable for its elongated shape due to its rapid rotation and its two known moons.", planet_id:20},
    { review: "Cryona, another dwarf planet in the Kuiper Belt, has a surface covered in methane ice and is one of the largest known objects in this distant region of our solar system.", planet_id:21},
    { review: "Pyros, the largest known dwarf planet in the solar system, is located in the scattered disk and has a highly elliptical orbit. Its surface is covered in a layer of ice.", planet_id:22},
    { review: "Sylva, one of the largest asteroids in the asteroid belt, is roughly spherical and has a highly inclined orbit compared to the plane of the solar system.", planet_id:23},
    { review: "Zephyra, another large asteroid in the asteroid belt, has a differentiated interior and a unique surface with a large crater that reveals its geological history.", planet_id:24}
]


const syncAndSeed= async()=> {
  await client.connect();
  console.log('Connected to the DB');

  await dropTables();
  console.log('Tables Dropped!');

  await createUsersTable();
  await createPlanetsTable();
  await createCartsTable();
  await createCartsPlanetsTable();
  await createReviewsTable();
  console.log('Tables Created!');

  await Promise.all(planets.map(planet => createPlanet(planet.name, planet.price, planet.type, planet.description)));
  console.log('Planets created');

  await createUser('Robin', '1234', 'robin@testing.com');
  await createUser('Ari', '1234', 'ari@testing.com');
  await createUser('Anija', '1234', 'anija@testing.com');
  await createUser('victor', '1234', 'victor@testing.com');
  console.log('Users created!');


  await Promise.all(seedReviews.map(review => createReview(review.review, review.planet_id)));
  console.log('Reviews created');

  await client.end();
  console.log('Disconnected from DB!');
}

syncAndSeed();

module.exports= {
  dropTables,
  createUsersTable,
  createCartsTable,
  createPlanetsTable,
  createReviewsTable,
  createCartsPlanetsTable
}