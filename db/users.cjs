const client = require('./client.cjs');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const createUser = async(username, password) => {
  try{
    const encryptPassword = await bcrypt.hash(password, 5);
    console.log(encryptPassword) //make sure this works before commenting this out.

    await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2);`, [username, encryptPassword])

  }catch(err) {
    console.log('Couldnt create user', err)
  }
}


const getUser = async(username, password) => {
  const { rows: [ user ] } = await client.query(`
    SELECT * FROM users
    WHERE username=$1;`, [username]);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(user && passwordMatch) {
      const assignToken = await jwt.sign({userId: user.id }, process.env.JWT_SECRET);

      return assignToken
    }else {
      throw new Error('Either username or password do not match our records.')
    }
}

module.export = { createUser, getUser }