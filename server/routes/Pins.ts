import express, { Request, Response } from "express";
const Pins = express.Router()
import {Pin} from '../db/index';

// => /pins/get-pins
Pins.get('/get-pins', (req: Request, res: Response) => {
  Pin.findAll()
  .then((result) => {
    res.status(200).send(result)
  })
  .catch((err) => {
    console.error(err)
    res.sendStatus(500)
  })
}) 


export default Pins