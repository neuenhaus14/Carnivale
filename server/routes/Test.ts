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
const Shared_content_status = models.shared_content_status;

const Test = Router();

Test.get('/getTest', (req: Request, res: Response) => {
  res.status(200).send('Booyah');
});

Test.get('/getContent/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  const getById = async (id) => {
    const contentResponse = await Content.findByPk(id, {
      include: [
        { model: User },
        { model: Plan },
        { model: Pin },
        { model: Comment },
        { model: Photo },
        { model: Tag },
      ],
    });

    contentResponse.dataValues.contentable = contentResponse.contentable;
    return contentResponse;
  };

  try {
    // TODO: recursively lookup content with a parentId of the input Id and add that to the root object
    const getContentWithChildren = async (id) => {
      const root = await getById(id);

      const getChildren = async (node: any) => {
        // get children from Content table
        const nodeChildren = await Content.findAll({
          where: { parentId: node.id },
        });

        // if the node has children...
        if (nodeChildren.length > 0) {

          // console.log('node in question:', node, 'node children:', nodeChildrenResponse)
          const nodeChildrenWithContentable = await Promise.all(
            nodeChildren.map(
              async (child) => await getById(child.dataValues.id)
            )
          );

          console.log('node children with C', nodeChildrenWithContentable);
          node.dataValues.children = nodeChildrenWithContentable;

          for (const childNode of node.dataValues.children) {
            await getChildren(childNode);
          }
        }
      };

      await getChildren(root);
      return root;
    };

    const contentThread = await getContentWithChildren(id);

    res.status(200).send(contentThread);
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
    // STEP 1: get all content shared with a user (recipient)
    const sharedContentResponse = await Shared_content.findAll({
      where: {
        recipientId,
      },
      include: [
        { model: User, as: 'sender' },
        { model: Content, include: [Tag, Shared_content_status] },
      ],
    });

    // STEP 2: get the contentable associated with each item of shared content. TODO: figure out how to achieve this with getContentable, a method of the Content model
    const sharedContentWithContentablesResponse = await Promise.all(
      sharedContentResponse.map(async (sharedContent) => {
        const contentId = sharedContent.dataValues.contentId;
        const contentableResponse = await Content.findByPk(contentId, {
          include: [Pin, Photo, Plan, Comment],
        });
        sharedContent.dataValues.contentable = contentableResponse.contentable;
        return sharedContent;
      })
    );

    res.status(200).json(sharedContentWithContentablesResponse);
  } catch (e) {
    console.error('SERVER ERROR, failed to get shared content', e);
    res.status(500).send(e);
  }
});

export default Test;
