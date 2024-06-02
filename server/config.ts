import dotenv from 'dotenv';

dotenv.config();

const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET;
const WEATHER_API_KEY: string = process.env.WEATHER_API_KEY;
const AUTH0_CLIENT_ID: string = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET: string = process.env.AUTH0_CLIENT_SECRET;
const ISSUER: string = process.env.ISSUER;
const REDIRECT_URL: string = process.env.REDIRECT_URL;
const ATLAS_URI: string = process.env.ATLAS_URI;
// RUN_MODE could be "demo" or "standard". "demo" deactivates buttons, limits functionality
const RUN_MODE: string = process.env.RUN_MODE;
// NODE_ENV determines webpack build and the database connection string in db's index.ts
const NODE_ENV: string = process.env.NODE_ENV;

const TAB_CATEGORIES: string = process.env.TAB_CATEGORIES;
const PIN_TYPES: string = process.env.PIN_TYPES;
const EVENT_LATITUDE: number = Number(process.env.EVENT_LATITUDE);
const EVENT_LONGITUDE: number= Number(process.env.EVENT_LONGITUDE);

export {
  EVENT_LONGITUDE,
  EVENT_LATITUDE,
  TAB_CATEGORIES,
  PIN_TYPES,
  NODE_ENV,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  WEATHER_API_KEY,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  ISSUER,
  REDIRECT_URL,
  ATLAS_URI,
  RUN_MODE,
};

// export default {

//   DATABASE_PASSWORD : process.env.DATABASE_PASSWORD,
//   DATABASE_USERNAME : process.env.DATABASE_USERNAME,
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
//   WEATHER_API_KEY: process.env.WEATHER_API_KEY
// }
