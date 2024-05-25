import { Request, Response, Router } from 'express';

import models from '../db/models/index';
const Shared_content = models.shared_content;
const Shared_content_status = models.shared_content_status;

const SharedContentRouter = Router();

SharedContentRouter.post(
  '/addSharedContent',
  async (req: Request, res: Response) => {
    const { contentId, senderId, recipientId } = req.body;

    try {
      // create shared content record
      const sharedContentResponse = await Shared_content.create({
        contentId,
        senderId,
        recipientId,
      });

      // if recipient has not yet had that piece of content shared with them, then create a shared_content_status record, which records whether it's archived or not
      const sharedContentStatusResponse =
        await Shared_content_status.findOrCreate({ where: {userId: recipientId,
          contentId
        } });
        res.status(200).send({sharedContentResponse, sharedContentStatusResponse})
    } catch (e) {
      console.error('SERVER ERROR: failed to share content', e);
      res.status(500).send(e);
    }
  }
);

export default SharedContentRouter;
