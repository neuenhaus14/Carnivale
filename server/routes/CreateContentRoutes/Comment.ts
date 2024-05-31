// ROUTES IN THIS FILE ARE FOR MAKING COMMENTS WITH EXP DB WITH CREATECONTENT MODAL; ORIGINAL ROUTES FOR POSTING COMMENTS ARE IN Home.ts

import { Request, Response, Router } from 'express';

import { createTags, shareContent } from '../../utils/content_creation_helpers';

import models from '../../db/models';


const Comment = models.comment;
const Content = models.content;

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

    const contentId = createCommentResponse.dataValues.content.id;

    // Create tags
    await createTags(contentId, tags)

    // Create shared_content records; content.userId is creator of content
    await shareContent(friendsToShareWith, contentId, content.userId)

    res.status(200).send(createCommentResponse);
  } catch (e) {
    console.error('SERVER ERROR: failed to create comment', e);
    res.status(500).send(e);
  }
});

export default CommentRouter;
