// import dotenv from "dotenv";

// import CLOUDINARY_API_KEY  from '../server/config'
// import  CLOUDINARY_API_SECRET  from '../server/config'

import { v2 as cloudinary } from 'cloudinary';
 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function handleUpload(file: any) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "Carnivale"
  });
  return res;
}

export default handleUpload



