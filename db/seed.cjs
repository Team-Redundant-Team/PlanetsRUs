const client= require('./client.cjs');
const {createUser}= require('./users.cjs');

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
      user_id SERIAL PRIMARY KEY,
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
      review_id SERIAL PRIMARY KEY, 
      review TEXT, 
      date DATE,
      planet_id BIGINT
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
      planet_id SERIAL PRIMARY KEY, 
      planet_name VARCHAR(30) NOT NULL,
      price FLOAT, 
      planet_type VARCHAR(30),
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
      cart_id SERIAL PRIMARY KEY, 
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
        cart_planet_id SERIAL PRIMARY KEY, 
        cart_id INT REFERENCES carts(cart_id) ON DELETE CASCADE,
        planet_id INT REFERENCES planets(planet_id) ON DELETE CASCADE,
        UNIQUE(cart_id, planet_id)
        );
        `);
      }catch(err) {
        console.log("Could not createReviewsTable", err)
  }
}

const JoinCPTable= async()=> {
  try{
    await client.query(`
      SELECT p.planet_name, p.price, p.planet_type, p.description
      FROM carts c
      JOIN carts_planets cp ON c.cart_id = cp.cart_id
      JOIN planets p ON cp.planet_id = p.planet_id
      WHERE c.cart_id = 1;
      `);
      }catch(err) {
        console.log("cannot create cartsPlanet Table", err)
  }
}

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
  
  await createCartsPlanetsTable();
  console.log('Carts PLanets Table Created!');

  await JoinCPTable();
  console.log('join table created')

  await createReviewsTable();
  console.log('ReviewsTable Created!');


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