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

module.export = { createUser }