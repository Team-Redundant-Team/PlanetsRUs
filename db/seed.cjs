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

const createPlanet = async () => {
  try{

  }catch(err) {
    console.log('Could not create Planet', err);
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