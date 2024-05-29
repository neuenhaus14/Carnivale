// ROUTES IN THIS FILE ARE FOR MAKING COMMENTS WITH EXP DB WITH CREATECONTENT MODAL; ORIGINAL ROUTES FOR POSTING COMMENTS ARE IN Home.ts

import { Request, Response, Router } from 'express';
import axios from 'axios';

import { createTags, shareContent } from '../utils/content_creation_helpers';

import models from '../db/models';

// TODO: we're using redirect url to tell axios where to go to make tags and sharedContent records; not sure if this is the right way to do that
import { REDIRECT_URL } from '../config';

const Comment = models.comment;
const Content = models.content;
const Tag = models.tags;
const Shared_content = models.shared_content;
const Shared_content_status = models.shared_content_status;

const CommentRouter = Router();

// creates comment, adds tags, shares with friends as stipulated
CommentRouter.post('/createComment', async (req: Request, res: Response) => {
  console.log('req.body', req.body)
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

    const contentId = createCommentResponse.dataValues.content.id;

    // Create tags
    await createTags(contentId, tags)

    /** await Promise.all(tags.map(async (tag) => {
      await axios.post(`${REDIRECT_URL}/api/tags/addTag` , {
        contentId: createCommentResponse.dataValues.content.id,
        tag
      })
    }))
    */

    // Create shared_content records; content.userId is creator of content
    await shareContent(friendsToShareWith, contentId, content.userId)

    /** await Promise.all(friendsToShareWith.map(async (friendId)=> {
      await axios.post(`${REDIRECT_URL}/api/sharedContent/addSharedContent`, {
        contentId: createCommentResponse.dataValues.content.id,
        senderId: content.userId,
        recipientId: friendId,
      })
    }))
    */

    res.status(200).send(createCommentResponse);
  } catch (e) {
    console.error('SERVER ERROR: failed to create comment', e);
    res.status(500).send(e);
  }
});

export default CommentRouter;
