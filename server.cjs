require('dotenv').config();

const jwt = require('jsonwebtoken');
const client = require('./db/client.cjs');

const { createUser, getUser, getUserByToken, changePassword, changeEmail } = require('./db/users.cjs')
const { getAllPlanets, getPlanetDetails, getOwnedBy, purchasePlanet} = require('./db/planets.cjs')
const { getPlanetReviews } = require('./db/reviews.cjs')

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=> {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// const verifyToken = (req,res,next) => {
//   const token = req.headers["authorization"];
//   if (!token){
//     return res.status(403).send('Bad Token')
//   }
//   try{
//     const decoder = jwt.verify(token.split(' ')[1], JWT_SECRET);
//     req.user = decoder;
//   } catch(error){
//     console.log(error)
//   } 
//   return next();
// }

// need to add verifyToken as middleware back to functions that will utilize token if want to test

app.use(express.json());
client.connect();

// login
app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const assignedToken = await getUser(username, password);
    console.log(assignedToken);
    res.json({ token: assignedToken });
  } catch (err){
    res.status(401).send('Failed to login');
  }
});

// register
// currently newUser will not entirely work because createUser needs to be modified to return success message
app.post('/api/register', async (req, res, next) => {
  try{
    const { username, password, email } = req.body;
    await createUser(username, password, email);
    res.status(200).json({ message: 'User Creation Successful', data: data });
  } catch(error){
    res.status(500).json({ message: 'User Creation Failed', error: error.message });
  }
})


// get single planet
// will also need to get reviews (need to create getReviews & also seed data)
app.get('/api/planets/:planetid', async (req, res, next) => {
  try {
    const id = parseInt(req.params.planetid)
    const planet = await getPlanetDetails(id);
    const reviews = await getPlanetReviews(id);
    res.send({ planet, reviews });
  } catch (err){
    next(err);
  }
})

// get all planets
app.get('/api/planets', async (req, res, next) => {
  try {
    const planets  = await getAllPlanets();
    res.send(planets);
  } catch (err){
    next(err);
  }
})

// planet purchase
app.put('/api/planets/:planetid', async (req,res,next) =>{
  try {
    const token = req.headers.authorization;
    const user = await getUserByToken(token);
    const planetid = parseInt(req.params.planetid)
    const purchasedPlanet = await purchasePlanet(user.id, planetid);
    res.send(purchasedPlanet);
  } catch (err){
    next(err);
  }
})

// get user information via token / logged in
app.get('/api/users', async (req, res, next) => {
  try {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders.split(' ')[1];
    const user = await getUserByToken(token);
    console.log(user);
    res.json(user);
  } catch(err) {
    next(err);
  }
})

// change password - need to make changePassword function
app.put('/api/change-pw', async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await getUserByToken(token);
    const { newPassword } = req.body;
    await changePassword(user.id, newPassword);
    res.status(200).json({ message: 'Password Change Successful', data: data })
  } catch (err){
    res.status(500).json({ message: 'Password Change Failed', error: error.message });
  }
})

// change email - need to make changeEmail function
app.put('/api/change-email', async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await getUserByToken(token);;
    const { newEmail } = req.body;
    await changeEmail(user.id, newEmail);
    res.status(200).json({ message: 'Email Change Successful', data: data })
  } catch (err){
    res.status(500).json({ message: 'Email Change Failed', error: error.message });
  }
})





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));