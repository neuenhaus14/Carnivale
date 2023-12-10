import express, { Request, Response } from "express";
const Pins = express.Router()
import {Photo, Pin} from '../db/index';
import { Join_pin_photo } from "../db/index";
import { User } from '../db/index';

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
    res.status(200).send(result)
  } catch (err) {
    console.error('SERVER ERROR: could not POST pin', err);
    res.status(500).send(err);
  }
})


Pins.get('/get-clicked-marker/:lng/:lat', async (req: Request, res: Response) => {
  const  {lng} = req.params;
  const  {lat}  = req.params;
  console.log(lng, lat)

  try {
    const clickedPin = await Pin.findOne({where: {longitude: lng, latitude: lat}});
    const clickedPinId = clickedPin.dataValues.id;
    
    console.log(clickedPin)
    let truePinCategory: string 
    for(const key in clickedPin.dataValues){
      if ((clickedPin as any)[key] === true) {
        truePinCategory = key;
        break;
      }
    }
    console.log('not map', truePinCategory)
    const joinPinPhotoResults = await Join_pin_photo.findAll({where : {pinId: clickedPinId }});
    const pinPhotoIds = joinPinPhotoResults.map((pin) => pin.dataValues.photoId);
    
    const pinPhotos = await Photo.findAll({where: {id: pinPhotoIds}});
    
    await Promise.all(pinPhotos.map(async (photo) => {
        try {
          const userObj =  await User.findOne({where: {id: photo.dataValues.ownerId}})
          if (userObj) {
            photo.dataValues.firstName = userObj.dataValues.firstName
            photo.dataValues.lastName = userObj.dataValues.lastName
            console.log('in map', truePinCategory)
            photo.dataValues.pinCategory = truePinCategory
          }
        } catch (err) {
          console.error(err, 'something went wrong with name collection for pins');
        }
      
      }))

   // console.log('bananananana', pinPhotos)

    res.status(200).send(pinPhotos)
    
  } catch (err) {
    console.error('SERVER ERROR: could not GET clicked pin', err);
    res.status(500).send(err);
  }
})


export default Pins