import {Request, Response, Router } from 'express';
import models from '../db/models/index';

const Tag = models.tag;
const Content_tag = models.content_tag;

const TagRouter = Router();

TagRouter.post('/addTag', async (req: Request, res: Response) => {
  const { contentId, tag } = req.body;

  console.log('contentId', contentId, 'tag', tag)
  // FIND OR CREATE A TAG IN TAGS table
  try {
  const tagResponse = await Tag.findOrCreate({where : {
    tag
  }})

  // ADD RECORD IN CONTENT_TAG JOIN TABLE
  const contentTagResponse = await Content_tag.create({
    tagId: tagResponse[0].id,
    contentId
  })

  res.send(contentTagResponse);
} catch (e) {
  console.error("SERVER ERROR: failed to add tag", e)
  res.status(500).send(e)
}

})

export default TagRouter;