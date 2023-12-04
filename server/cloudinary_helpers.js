import {v2 as cloudinary} from 'cloudinary';
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../server/config.js')
cloudinary.config({
  cloud_name: 'dj5uxv8tg',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});