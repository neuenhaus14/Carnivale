import express, { Request, Response } from "express";
const Pins = express.Router()
import {Pin} from '../db/index';

// => api/pins/get-pins
Pins.get('/get-pins', async (req: Request, res: Response) => {
  try {
    const pinResults = await Pin.findAll()
    console.log(pinResults)
    res.status(200).send(pinResults)
  } catch (err) {
    console.error('SERVER ERROR: could not GET pins', err);
    res.status(500).send(err);
  }
})

Pins.post('/create-pin/:ownerId', async(req: Request, res: Response) => {
  const { ownerId } = req.params
  const {longitude, latitude, isFree, isToilet, isFood, isPersonal} = req.body.options
  
  try {
    const result = await Pin.create({ longitude, latitude, isFree, isToilet, isFood, isPersonal, ownerId })
    console.log(result)
    res.status(200)
  } catch (err) {
    console.error('SERVER ERROR: could not POST pin', err);
    res.status(500).send(err);
  }
})


export default Pins