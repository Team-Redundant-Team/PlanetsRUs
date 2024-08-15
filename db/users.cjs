const client = require('./client.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const createUser = async(username, password, userEmail) => {
  try{
    const encryptPassword = await bcrypt.hash(password, 5);

    await client.query(`
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3);`, [username, encryptPassword, userEmail])

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

const getUserByToken = async(token) => {
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  
  const { rows: [ user ] } = await client.query(`
    SELECT id, username FROM users
    WHERE id=${userId}
  `);

  return user;
}

const changePassword = async (userId, newPassword) => {
  try{
    const encryptPassword = await bcrypt.hash(newPassword, 5);
    await client.query(`
      UPDATE users 
      SET password = $2
      WHERE id=$1;`,[userId, encryptPassword]);

  }catch(err) {
    console.log('could not change password, rip', err);
  }
}

const changeEmail = async (userId, newEmail) => {
  try{
    await client.query(`
      UPDATE users
      SET email =$2
      WHERE id = $1;`,[userId, newEmail]);

  }catch(err) {
    console.log(`could not change email`, err);
  }
}

module.exports = { 
  createUser,
  getUser,
  getUserByToken,
  changePassword,
  changeEmail
 }