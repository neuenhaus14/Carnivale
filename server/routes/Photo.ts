// ROUTES IN THIS FILE ARE FOR POSTING PHOTOS WITH EXP DB WITH CREATECONTENT MODAL; ORIGINAL ROUTES FOR POSTING PHOTOS ARE IN PhotoUpload.ts

import { Request, Response, Router } from 'express';
import handleUpload from '../utils/cloudinary_helpers';
import { createTags, shareContent } from '../utils/content_creation_helpers';
import multer from 'multer';
import models from '../db/models/index';

const Photo = models.photo;
const Content = models.content;
const Pin = models.pin; // maybe we need this?

const PhotoRouter = Router();

//Multer provides us with two storage options: disk and memory storage. In the below snippet, we start by selecting the storage option we want for our Multer instance. We choose the memory storage option because we do not want to store parsed files on our server; instead, we want them temporarily stored on the RAM so that we can quickly upload them to Cloudinary.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
});

const unpackFormData = upload.fields([
  { name: 'contentDetails' },
  { name: 'imageFile' },
]);

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

PhotoRouter.post('/createPhoto', async (req: Request, res: Response) => {
  try {
    // run thru mw to unpack the file and the details to be used to add photo db record
    await runMiddleware(req, res, unpackFormData);

    // details are saved to req.body after mw
    const contentDetails = JSON.parse(req.body.contentDetails);
    // image file saved to req.files
    const file = req.files['imageFile'][0];
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

    const cldRes = await handleUpload(dataURI);
    const photoURL = cldRes.secure_url;

    // Then get url back from Cloudinary and add photo to database
    const createPhotoResponse = await Photo.create(
      {...contentDetails, photoURL},
      { include: [Content] }
    );

    const contentId = createPhotoResponse.dataValues.content.id;

    // create tags
    await createTags(contentId, contentDetails.tags);
    // share content
    await shareContent(contentDetails.friendsToShareWith, contentId, contentDetails.content.userId)

    res.status(200).send(createPhotoResponse);
  } catch (e) {
    console.error('SERVER ERROR: failed to post photo', e);
    res.status(500).send(e);
  }
});

export default PhotoRouter;
