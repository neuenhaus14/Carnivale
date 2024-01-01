import  { v2 as cloudinary }  from "cloudinary" //grabbing reference to an already configured cloudinary object
import handleUpload from "../utils/cloudinary_helpers"
import express, { Request, Response, Router } from "express";
import multer from 'multer';
import { Join_pin_photo, Photo } from '../db'
import { Pin } from '../db'

//Multer provides us with two storage options: disk and memory storage. In the below snippet, we start by selecting the storage option we want for our Multer instance. We choose the memory storage option because we do not want to store parsed files on our server; instead, we want them temporarily stored on the RAM so that we can quickly upload them to Cloudinary.
const storage = multer.memoryStorage();
//console.log('storage', storage)
const upload = multer({  storage: storage,
  limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
  }});
//console.log('upload', upload)
const myUploadMiddleware = upload.single("sample_file");
const ImageRouter = express.Router()
let photoURL : string;

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}


//Post logic that takes an image from the front page and adds the image to cloudinary and posts the reference url to our local database as well
ImageRouter.post('/upload', async (req: Request, res: Response) => {

  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    //console.log('backend', cldRes)
    const url = cldRes.secure_url
    photoURL = url
    //after posting to cloudinary, we take the cloudResponse (cldRes) and access the secure_url data to our database
    const newPhoto = await Photo.create({
      photoURL,
      // latitude,
      // longitude
    })
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
 })


 ImageRouter.put('/save/:ownerId', async (req: Request, res: Response) => {
  const {latitude, longitude, isThrow, isPin, isCostume, description} = req.body.options
  const { ownerId } = req.params

    try{
      await Photo.update({latitude, longitude, isThrow, isPin, isCostume, ownerId, description}, {where: {photoURL}})
      const matchedLatLngPhotos = await Photo.findAll({where: {latitude, longitude}})
      const matchedLatLngPin = await Pin.findOne({where: {latitude, longitude}})

      await Promise.all(matchedLatLngPhotos.map(async (photo) => {
        try {
          const matchedPinId = matchedLatLngPin.dataValues.id
          const newRelationship = await Join_pin_photo.create({ photoId: photo.dataValues.id, pinId: matchedPinId})
        } catch (err) {
          console.error(err, 'something went wrong');
        }
      }))

      res.status(200).send('you did it!')

    } catch (error) {
      console.error(error);
    }

 })

  //handles the posting logic from homepage
  ImageRouter.put('/post/:ownerId', async (req: Request, res: Response) => {
    const {latitude, longitude, isThrow, isPin, isCostume, description} = req.body.options
    const { ownerId } = req.params

      try{
        await Photo.update({latitude, longitude, isThrow, isPin, isCostume, ownerId, description}, {where: {photoURL}})

        res.status(200).send('you did it!')

      } catch (error) {
        console.error(error);
      }

   })
/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath: string) => {

  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    chunk_size: 6000000,
    overwrite: true,
    folder : "Carnivale"
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload_large(imagePath,
       options);
    //console.log(result);
    return result.public_id;
  } catch (error) {
    console.error('upload image', error);
  }
};


export const config = {
  api: {
    bodyParser: false,
  },
};

export default ImageRouter;

