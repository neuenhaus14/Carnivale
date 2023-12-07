// import express, { Request, Response, Router } from "express";
// import {v2 as cloudinary} from 'cloudinary';
// import path from "path";
// import { db } from "./db";
import dotenv from "dotenv";

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
  console.log('handleUpload in cloud helpers response', res)
  return res;
}

export default handleUpload


// cloudinary.config({
//   secure: true
// });

// // cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
// //   { public_id: "olympic_flag" },
// //   function(error, result) {console.log(result); });

// export async function handleUpload(file: string) {
//   const res = await cloudinary.uploader.upload(file, {
//     resource_type: "auto",
//   });
//   return res
// }


