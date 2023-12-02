const express = require('express');
const path = require('path');
const { db } = require('./db');
require('dotenv').config()

const app = express();
const port = 4000;

const routeHandler = express.Router()
const distPath = path.resolve(__dirname, '..', 'dist');

app.use(express.static(distPath)); 
app.use('/', routeHandler)


app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// SERVER CONNECTION
app.listen(port, () => {
  console.log(`
  Listening at: http://127.0.0.1:${port}
  `);
});