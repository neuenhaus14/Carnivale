import  { v2 as cloudinary }  from "cloudinary" //grabbing reference to an already configured cloudinary object
import handleUpload from "../utils/cloudinary_helpers" 
import express, { Request, Response, Router } from "express";
import multer from 'multer';

//Multer provides us with two storage options: disk and memory storage. In the below snippet, we start by selecting the storage option we want for our Multer instance. We choose the memory storage option because we do not want to store parsed files on our server; instead, we want them temporarily stored on the RAM so that we can quickly upload them to Cloudinary.
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single("sample_file");
const ImageRouter = express.Router()

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

//TODO:Take the res from the post and manipulate that data into the db somehow

ImageRouter.post('/upload', async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
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
    overwrite: true,
    folder : "Carnivale"
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath,
       options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error('upload image', error);
  }
};

/////////////////////////////////////
// Gets details of an uploaded image
/////////////////////////////////////
const getAssetInfo = async (publicId: string) => {

  // Return colors in the response
  const options = {
    colors: true,
  };

  try {
      // Get details about the asset
      const result = await cloudinary.api.resource(publicId, options);
      console.log(result);
      return result.colors;
      } catch (error) {
      console.error(error);
  }
};
//////////////////////////////////////////////////////////////
// Creates an HTML image tag with a transformation that
// results in a circular thumbnail crop of the image
// focused on the faces, applying an outline of the
// first color, and setting a background of the second color.
//////////////////////////////////////////////////////////////
const createImageTag = (publicId: string, ...colors: (string | number)[]) => {

  // Set the effect color and background color
  const [effectColor, backgroundColor] = colors;

  // Create an image tag with transformations applied to the src URL
  const imageTag = cloudinary.image(publicId, {
    transformation: [
      { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
      { radius: 'max' },
      { effect: 'outline:10', color: effectColor },
      { background: backgroundColor },
    ],
  });

  return imageTag;
};
//////////////////
//
// Main function
//
//////////////////
(async () => {

  // Set the image to upload
  const imagePath = 'https://i1.wp.com/bizstinks.com/wp-content/uploads/2016/07/IMG_1879-e1468862064544-683x1024.jpg?zoom=2&resize=564%2C846&ssl=1';

  // Upload the image
  const publicId = await uploadImage(imagePath);

  // Get the colors in the image
  const colors = await getAssetInfo(publicId);

  // Create an image tag, using two of the colors in a transformation
  const imageTag = await createImageTag(publicId, colors[0][0], colors[1][0]);

  // Log the image tag to the console
  console.log(imageTag);

})//();
export const config = {
  api: {
    bodyParser: false,
  },
};

export default ImageRouter;
//{uploadImage, getAssetInfo, createImageTag}


// import express, { Request, Response, Router } from "express";
// import multer from 'multer';
// import { handleUpload } from '../cloudinary_helpers';

// const Upload = Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const myUploadMiddleware = upload.single("uploaded_file");

// const  runMiddleware = (req, res, fn) => {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }

// Upload.post("/api/photo",
// async (req: any, res: any) => {
//   console.log('Evan')
//   try {
//     await runMiddleware(req, res, myUploadMiddleware);
//     console.log(req)
//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     //req.file.buffer
//     const dataURI = `data:${req.file.mimetype}; base64, ${b64}`
//     const cldRes = await handleUpload(dataURI);
//     res.json(cldRes);
//   } catch (error) {
//     console.error('upload error PhotoUpload.js', error);
//     res.status(500).send({
//       message: error.message
//     });
//   }
// });
// export default Upload;