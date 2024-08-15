const client= require('./client.cjs');
const {createUser}= require('./users.cjs');
const { createPlanet }=require('./planets.cjs');

const dropTables=async()=> {
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
      date DATE,
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
// fix this later rename and repurpose
// const JoinCPTable= async()=> {
//   try{
//     await client.query(`
//       SELECT p.planet_name, p.price, p.planet_type, p.description
//       FROM carts c
//       JOIN carts_planets cp ON c.cart_id = cp.cart_id
//       JOIN planets p ON cp.planet_id = p.planet_id
//       WHERE c.cart_id = 1;
//       `);
//       }catch(err) {
//         console.log("cannot create cartsPlanet Table", err)
//   }
// }

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


const syncAndSeed= async()=> {
  await client.connect();
  console.log('Connected to the DB');

  await dropTables();
  console.log('Tables Dropped!');

  await createUsersTable();
  console.log('UsersTable Created!');

  await createPlanetsTable();
  console.log('PlanetsTable Created!');

  await createCartsTable();
  console.log('Carts Table Created!');

  await planets.forEach(planet => createPlanet(planet.name, planet.price, planet.type, planet.description));
  console.log('created planets');
  
  await createCartsPlanetsTable();
  console.log('Carts PLanets Table Created!');

  // await JoinCPTable();
  // console.log('join table created')

  await createReviewsTable();
  console.log('ReviewsTable Created!');

  await createUser('Robin', '1234', 'robin@testing.com');
  console.log('User Robin created!');

  await createUser('Ari', '1234', 'ari@testing.com');
  console.log('User Ari created!');

  await createUser('Anija', '1234', 'anija@testing.com');
  console.log('User Anija created!');

  await createUser('victor', '1234', 'victor@testing.com');
  console.log('User Victor created!');

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