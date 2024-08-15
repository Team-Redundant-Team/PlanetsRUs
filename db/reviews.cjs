const client = require('./client.cjs');

const createReview = async (review, planet_id) => {
  try{
    await client.query(`
      INSERT INTO reviews (review, planet_id)
      VALUES ($1, $2);`, [review, planet_id]);

  } catch(err) {
    console.log('Couldnt create review', err)
  }
}

module.exports = { createReview };