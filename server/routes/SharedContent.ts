import { Request, Response, Router } from 'express';

import models from '../db/models/index';
import { REDIRECT_URL } from '../config';
import axios from 'axios';

const Shared_content = models.shared_content;
const Shared_content_status = models.shared_content_status;
const User_plan = models.user_plan;

const SharedContentRouter = Router();

// This route is used only by ShareContentModal, and just routes each share to the '/addSharedContent' route below TODO: fix this or the route below so it can do bulk creations
SharedContentRouter.post(
  '/addSharedContentArray',
  async (req: Request, res: Response) => {
    const { friendsToShareWith, contentId, senderId } = req.body;

    try {
      await Promise.all(
        friendsToShareWith.map(async (friendId) => {
          await axios.post(
            `${REDIRECT_URL}/api/sharedContent/addSharedContent`,
            {
              recipientId: friendId,
              senderId,
              contentId,
            }
          );
        })
      );
      res.sendStatus(200);
    } catch (e) {
      console.error('SERVER ERROR: failed to share content', e);
      res.status(500).send(e);
    }
  }
);

// Shares a single piece of content, is used to when creating content through each content types create[Content] route via shareContent utility function in create-content-helpers. TODO: fix this so it can do bulk creations
SharedContentRouter.post(
  '/addSharedContent',
  async (req: Request, res: Response) => {
    const { contentId, senderId, recipientId } = req.body;

    try {
      console.log('here')
      // create shared content record
      const sharedContentResponse = await Shared_content.create({
        contentId,
        senderId,
        recipientId,
      });

      // if recipient has not yet had that piece of content shared with them, then create a shared_content_status record, which records whether it's archived or not
      const sharedContentStatusResponse =
        await Shared_content_status.findOrCreate({
          where: { userId: recipientId, contentId },
        });
      res
        .status(200)
        .send({ sharedContentResponse, sharedContentStatusResponse });

      // if shared content is an event, then findOrCreate a user_plan record to track whether recipient is going to the event. It's a findOrCreate because recipient may have already had event shared with them
      const userPlanResponse = await User_plan.findOrCreate({
        where: {
          contentId,
          userId: recipientId,
        },
        defaults: {
          status: 'pending',
        },
      });
    } catch (e) {
      console.error('SERVER ERROR: failed to share content', e);
      res.status(500).send(e);
    }
  }
);

export default SharedContentRouter;
