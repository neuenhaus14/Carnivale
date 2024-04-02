import { Request, Response, Router } from 'express';

import models from '../db/models/index';
const Content = models.content;
const Photo = models.photo;
const Pin = models.pin;
const Comment = models.comment;
const Plan = models.plan;
const User = models.user;
const Tag = models.tag;
const Content_tag = models.content_tag;
const Shared_content = models.shared_content;

const Test = Router();

Test.get('/getTest', (req: Request, res: Response) => {
  res.status(200).send('Booyah');
});

Test.get('/getContent/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const contentResponse = await Content.findByPk(id, {
      include: [User, Plan, Pin, Comment, Photo],
    });

    contentResponse.dataValues.contentable = contentResponse.contentable;
    console.log('HERE', contentResponse)
    res.status(200).send(contentResponse);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error');
  }
});

Test.get(
  '/getContentable/type=:contentableType&id=:contentableId',
  async (req: Request, res: Response) => {
    const { contentableType, contentableId } = req.params;

    try {
      let contentableResponse;
      const includeOptions = {
        include: [
          {
            model: Content,
            include: [{ model: User }, { model: Tag }],
          },
        ],
      };

      switch (contentableType) {
        case 'pin':
          contentableResponse = await Pin.findByPk(
            Number(contentableId),
            includeOptions
          );
          break;
        case 'photo':
          contentableResponse = await Photo.findByPk(
            Number(contentableId),
            includeOptions
          );
          break;
        case 'plan':
          contentableResponse = await Plan.findByPk(
            Number(contentableId),
            includeOptions
          );
          break;
        case 'comment':
          contentableResponse = await Comment.findByPk(
            Number(contentableId),
            includeOptions
          );
          break;
      }

      res.status(200).send(contentableResponse);
    } catch (e) {
      console.error('DATABASE ERROR: failed to get contentable', e);
      res.status(500).send(e);
    }
  }
);

Test.get('/getSharedContent/:userId', async (req: Request, res: Response) => {
  const recipientId = Number(req.params.userId);

  try {
    // const sharedContentResponse = await Shared_content.findAll({
    //   where: {
    //     recipientId,
    //   },
    //   include: [
    //     { model: User, as: 'sender' },
    //     { model: User, as: 'recipient' },
    //     { model: Content, include: [Tag] },
    //   ],
    // });

    // console.log('HERE: ', sharedContentResponse[0]);
    // res.status(200).send(sharedContentResponse);

    const content1 = await Content.findByPk(1);

    // const contentable1 = await content1.getContentable({where:{id:1}});

    console.log('HEERE', Content.findByPk.toString())

    res.status(200).send(content1)
  } catch (e) {
    console.error('SERVER ERROR, failed to get shared content', e);
    res.status(500).send(e);
  }
});

export default Test;
