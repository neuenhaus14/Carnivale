import express, { Request, Response } from "express";
const Pins = express.Router()
import {Photo, Pin} from '../db/index';
import { Join_pin_photo } from "../db/index";

// => api/pins/get-pins
Pins.get('/get-pins', async (req: Request, res: Response) => {
  try {
    const pinResults = await Pin.findAll()
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
    //console.log(result)
    res.status(200).send(result)
  } catch (err) {
    console.error('SERVER ERROR: could not POST pin', err);
    res.status(500).send(err);
  }
})


Pins.get('/get-clicked-marker/:lng/:lat', async (req: Request, res: Response) => {
  const  {lng} = req.params;
  const  {lat}  = req.params;

  try {
    const clickedPin = await Pin.findOne({where: {longitude: lng, latitude: lat}})
    const clickedPinId = clickedPin.dataValues.id
    
    const joinPinPhotoResults = await Join_pin_photo.findAll({where : {pinId: clickedPinId }})
    const pinPhotoIds = joinPinPhotoResults.map((pin) => pin.dataValues.photoId)
    
    const pinPhotos = await Photo.findAll({where: {id: pinPhotoIds}})
    //console.log(pinPhotos)
    res.status(200).send(pinPhotos)
    
  } catch (err) {
    console.error('SERVER ERROR: could not GET clicked pin', err);
    res.status(500).send(err);
  }
})


export default Pins