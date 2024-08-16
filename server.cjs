require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const client = require('./db/client.cjs');




const {
  createUser,
  getUser,
  getUserByToken,
  changePassword,
  changeEmail,
} = require('./db/users.cjs');
const {
  getAllPlanets,
  getPlanetDetails,
  getOwnedBy,
  purchasePlanet,
} = require('./db/planets.cjs');
const { getPlanetReviews } = require('./db/reviews.cjs');

const app = express();

// Connect to the database
client.connect();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // This already includes bodyParser.json()

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware for token verification
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Bad Token');
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    console.error(error);
    return res.status(403).send('Invalid Token');
  }
  return next();
};

// Authentication routes
app.post('/api/Auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    const assignedToken = await getUser(username, password);
    res.json({ token: assignedToken });
  } catch (err) {
    res.status(401).send('Failed to login');
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log(`Register attempt: ${username}, ${email}`);
    const newUser = await createUser(username, password, email);
    res.status(200).json({ message: 'User Creation Successful', user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'User Creation Failed', error: error.message });
  }
});

// Planet routes
app.get('/api/planets/:planetid', async (req, res, next) => {
  try {
    const id = parseInt(req.params.planetid);
    const planet = await getPlanetDetails(id);
    const reviews = await getPlanetReviews(id);
    res.send({ planet, reviews });
  } catch (err) {
    next(err);
  }
});

app.get('/api/planets', async (req, res, next) => {
  try {
    const planets = await getAllPlanets();
    res.json(planets);
  } catch (err) {
    next(err);
  }
});

app.put('/api/planets/:planetid', verifyToken, async (req, res, next) => {
  try {
    const user = await getUserByToken(req.user);
    const planetid = parseInt(req.params.planetid);
    const purchasedPlanet = await purchasePlanet(user.id, planetid);
    res.send(purchasedPlanet);
  } catch (err) {
    next(err);
  }
});

// User routes
app.get('/api/users', verifyToken, async (req, res, next) => {
  try {
    const user = await getUserByToken(req.user);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.put('/api/change-pw', verifyToken, async (req, res, next) => {
  try {
    const user = await getUserByToken(req.user);
    const { newPassword } = req.body;
    await changePassword(user.id, newPassword);
    res.status(200).json({ message: 'Password Change Successful' });
  } catch (err) {
    res.status(500).json({ message: 'Password Change Failed', error: err.message });
  }
});

app.put('/api/change-email', verifyToken, async (req, res, next) => {
  try {
    const user = await getUserByToken(req.user);
    const { newEmail } = req.body;
    await changeEmail(user.id, newEmail);
    res.status(200).json({ message: 'Email Change Successful' });
  } catch (err) {
    res.status(500).json({ message: 'Email Change Failed', error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
