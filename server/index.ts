// const express = require('express');
// const path = require('path');
// const { db } = require('./db');
//require('dotenv').config()

import express from 'express'
import path from 'path'
import {db} from './db'
import dotenv from 'dotenv'
dotenv.config()


// this inits the type for req/res for typescript
import { Request, Response } from 'express';

const app = express();
const port = 4000;

const routeHandler = express.Router()
const distPath = path.resolve(__dirname, '..', 'dist');

app.use(express.static(distPath)); 
app.use('/', routeHandler)


app.get('/*', function(req: Request, res: Response) {
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