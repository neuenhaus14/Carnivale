

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