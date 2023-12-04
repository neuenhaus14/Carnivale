import {v2 as cloudinary} from 'cloudinary';
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../server/config.js')
cloudinary.config({
  cloud_name: 'dj5uxv8tg',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function(error, result) {console.log(result); });

export async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res
}