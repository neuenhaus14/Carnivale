const express = require('express');
const path = require('path');
const { db } = require('./db');
require('dotenv').config()

const app = express();
const port = 4000;

const distPath = path.resolve(__dirname, '..', 'dist');

app.use(express.static(distPath)); 

// SERVER CONNECTION
app.listen(port, () => {
  console.log(`
  Listening at: http://127.0.0.1:${port}
  `);
});