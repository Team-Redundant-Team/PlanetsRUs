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


module.exports = { getOwnedBy }