const client = require('./client.cjs')

const getOwnedBy = async(planetName) =>{
  try{
    const getQuery = await client.query(`
      SELECT u.username
      FROM users u
      JOIN carts c ON u.id = c.user_id
      JOIN carts_planets cp ON c.id = cp.cart_id
      JOIN planets p ON cp.planet_id = p.id
      WHERE p.planet_name = $1;
      `, [planetName]);

    return getQuery.rows.map(row => row.username);

  }catch(err){
    console.log('couldnt get ownedby function', err);
    throw new Error(`couldnt get the ownedby function for ${planetName}`, err);
  }
}

const getAllPlanets = async() => {
  try{
    await client.query(`
      SELECT * FROM planets;`)
  }catch(err){
    console.log('couldnt retrieve all planets', err);
    throw new Error(`coudlnt retrieve all planets`, err);
  }
}

const getPlanetDetails = async (planetName) => {
  try{
    const planetDetails = await client.query(`
      SELECT * FROM planets
      WHERE name=$1;`,[planetName]);

    return planetDetails.rows.map(row => row.name);

  }catch(err){
    console.log(`couldnt get ${planetName} details`, err);
    throw new Error(`couldnt get all planet details for ${planetName}`, err);
  }
}

const purchasePlanet = async(userId, planetId) => {
  try{
    await client.query('BEGIN');

    const planetResults = await client.query(`
      SELECT name
      FROM planets
      WHERE id=$1;`,[planetId]);

    const planetName = planetResults.rows[0]?.name;

    if(!planetName) {
      throw new Error('Planet not found');
    }

    const { id: cartId } = await client.query(`
      INSERT INTO carts (user_id, is_open)
      VALUES ($1, true)
      RETURNING id;`, [userId]);

    await client.query(`
      INSERT INTO carts_planets (cart_id, planet_id)
      VALUES ($1, $2);`,[cartId, planetId]);

    await client.query(`
      UPDATE carts
      SET is_open = false
      WHERE id = $1;`,[cartId]);

    await client.query('COMMIT');


  }catch(err) {
    await client.query('ROLLBACK');
    console.log(`could not purchase ${planetName},`, err);
    throw new Error(`Could not purchase ${planetName}: ${err.message}`);
  }

}

const createPlanet = async (planetName, price, type, description) => {
  try{
    await client.query(`
      INSERT INTO planets (name, price, type, description)
      VALUES ($1, $2, $3, $4);`,[planetName, price, type, description])
  }catch(err) {
    console.log('Could not create Planet', err);
    throw new Error('could not create this planet');
  }
}


module.exports = { getOwnedBy, getAllPlanets, getPlanetDetails, purchasePlanet, createPlanet }