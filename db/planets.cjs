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
    console.log('couldnt get ownedby function', err)
    throw err
  }
}

const getAllPlanets = async() => {
  try{
    await client.query(`
      SELECT * FROM planets;`)
  }catch(err){
    console.log('couldnt retrieve all planets', err)
    throw new Error
  }
}

const getPlanetDetails = async (planetName) => {
  try{
    const planetDetails = await client.query(`
      SELECT * FROM planets
      WHERE name=$1;`,[planetName]);

    return planetDetails.rows.map(row => row.name);

  }catch(err){
    console.log(`couldnt get ${planetName} details`, err)
    throw new Error
  }
}


module.exports = { getOwnedBy, getAllPlanets, getPlanetDetails }