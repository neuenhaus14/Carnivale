import dotenv from 'dotenv';


dotenv.config();

const DATABASE_PASSWORD : string =  process.env.DATABASE_PASSWORD;
const DATABASE_USERNAME : string = process.env.DATABASE_USERNAME;
const CLOUDINARY_API_KEY : string = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET : string = process.env.CLOUDINARY_API_SECRET;
const WEATHER_API_KEY : string = process.env.WEATHER_API_KEY;
const AUTH0_CLIENT_ID : string = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET : string = process.env.AUTH0_CLIENT_SECRET;
const ISSUER : string = process.env.ISSUER;
const REDIRECT_URL : string = process.env.REDIRECT_URL;
const ATLAS_URI : string = process.env.ATLAS_URI;
// RUN_MODE could be "demo" or "standard". "demo" deactivates buttons
const RUN_MODE : string = process.env.RUN_MODE;

export {
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  WEATHER_API_KEY,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  ISSUER,
  REDIRECT_URL,
  ATLAS_URI
}

// export default {

//   DATABASE_PASSWORD : process.env.DATABASE_PASSWORD,
//   DATABASE_USERNAME : process.env.DATABASE_USERNAME,
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
//   WEATHER_API_KEY: process.env.WEATHER_API_KEY
// }