require('dotenv').config();

const express = require('express');
const client = require('./db/client.cjs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

client.connect();



app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));