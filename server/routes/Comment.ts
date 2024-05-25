import { Request, Response, Router } from 'express';
import axios from 'axios';

import models from '../db/models';

// TODO: we're using redirect url to tell axios where to go to make tags; not sure if this is the right way to do that
import { REDIRECT_URL } from '../config';

const Comment = models.comment;
const Content = models.content;
const Tag = models.tags;
const Shared_content = models.shared_content;
const Shared_content_status = models.shared_content_status;

const CommentRouter = Router();

// creates comment, adds tags, shares with friends as stipulated
CommentRouter.post('/createComment', async (req: Request, res: Response) => {
  const { content, description, tags, friendsToShareWith } = req.body;
  try {
    const createCommentResponse = await Comment.create(
      {
        content: {
          ...content,
        },
        description,
      },
      {
        include: [
          Content,
        ],
      }
    );

    // Create tags
    // TODO: is REDIRECT_URL the best way forward here? Is there something is axios config that allows us to set endpoint without writing it in?
    await Promise.all(tags.map(async (tag) => {
      await axios.post(`${REDIRECT_URL}/api/tags/addTag` , {
        contentId: createCommentResponse.dataValues.content.id,
        tag
      })
    }))

    // Create shared_content records
    await Promise.all(friendsToShareWith.map(async (friendId)=> {
      await axios.post(`${REDIRECT_URL}/api/sharedContent/addSharedContent`, {
        contentId: createCommentResponse.dataValues.content.id,
        senderId: content.userId,
        recipientId: friendId,
      })
    }))

    res.status(200).send(createCommentResponse);
  } catch (e) {
    console.error('SERVER ERROR: failed to create comment', e);
    res.status(500).send(e);
  }
});

export default CommentRouter;
