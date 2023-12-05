import dotenv from 'dotenv';


dotenv.config();

const  DATABASE_PASSWORD : string =  process.env.DATABASE_PASSWORD;
const DATABASE_USERNAME : string = process.env.DATABASE_USERNAME;
const CLOUDINARY_API_KEY : string = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET : string = process.env.CLOUDINARY_API_SECRET;
const WEATHER_API_KEY : string = process.env.WEATHER_API_KEY;

export {
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  WEATHER_API_KEY
}

// export default {

//   DATABASE_PASSWORD : process.env.DATABASE_PASSWORD,
//   DATABASE_USERNAME : process.env.DATABASE_USERNAME,
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
//   WEATHER_API_KEY: process.env.WEATHER_API_KEY
// }