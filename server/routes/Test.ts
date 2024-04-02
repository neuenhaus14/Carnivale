import { Request, Response, Router } from 'express';

import models from '../db/models/index';
const Content = models.content;
const Photo = models.photo;
const Pin = models.pin;
const Comment = models.comment;
const Plan = models.plan;
const User = models.user;

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

    console.log('response dataValues', contentResponse.dataValues);
    console.log('response contentable', contentResponse.contentable);

    contentResponse.dataValues.contentable = contentResponse.contentable;

    // const content = contentResponse.contentable;
    // const responseObject = {...contentResponse, content};

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

      switch (contentableType) {
        case 'pin':
          contentableResponse = await Pin.findByPk(Number(contentableId), {
            include: {model: Content, include: [User]},
          });
          break;
        case 'photo':
          contentableResponse = await Photo.findByPk(Number(contentableId), {
            include: {model: Content, include: [User]},
          });
          break;
        case 'plan':
          contentableResponse = await Plan.findByPk(Number(contentableId), {
            include: {model: Content, include: [User]},
          });
          break;
        case 'comment':
          contentableResponse = await Comment.findByPk(Number(contentableId), {
            include: {model: Content, include: [User]},
          });
          break;
      }

      res.status(200).send(contentableResponse);
    } catch (e) {
      console.error('DATABASE ERROR: failed to get contentable', e);
      res.status(500).send(e);
    }
  }
);

export default Test;
