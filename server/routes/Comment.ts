import { Request, Response, Router } from 'express';


import models from '../db/models';

const Comment = models.comment;
const Content = models.content;

const CommentRouter = Router();

CommentRouter.post('/createComment', (req: Request, res: Response) => {

  const { content, description, tags } = req.body
  try {
    const createCommentResponse = Comment.create({
      content: {
        ...content,
      },
      description
    },
    { include: [Content] })
    // CREATE TAGS
    res.status(200).send(createCommentResponse)
  } catch (e) {
    console.error('SERVER ERROR: failed to create comment', e);
    res.status(500).send(e)
  }




})

export default CommentRouter;