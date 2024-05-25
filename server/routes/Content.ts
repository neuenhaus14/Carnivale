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

const ContentRouter = Router();

ContentRouter.get('/getTest', (req: Request, res: Response) => {
  res.status(200).send('Booyah');
});

const organizeContent = (contentItem) => {
  const contentKeys = [
    'id',
    'latitude',
    'longitude',
    'upvotes',
    'placement',
    'contentableType',
    'contentableId',
    'parentId',
    'createdAt',
    'updatedAt',
    'userId',
  ];

  contentItem.dataValues.contentable = contentItem.contentable;

  // save content data as new key on dataValues
  contentItem.dataValues.content = {
    id: contentItem.id,
    latitude: contentItem.latitude,
    longitude: contentItem.longitude,
    upvotes: contentItem.upvotes,
    placement: contentItem.placement,
    contentableType: contentItem.contentableType,
    contentableId: contentItem.contentableId,
    parentId: contentItem.parentId,
    createdAt: contentItem.createdAt,
    updatedAt: contentItem.updatedAt,
    userId: contentItem.userId,
  };

  // delete the original 'content' kv's after adding them to new 'content' key
  for (const key of contentKeys) {
    delete contentItem.dataValues[key];
  }

  return contentItem;
};

// get content with nested thread
ContentRouter.get('/getContent/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  // const contentKeys = [
  //   'id',
  //   'latitude',
  //   'longitude',
  //   'upvotes',
  //   'placement',
  //   'contentableType',
  //   'contentableId',
  //   'parentId',
  //   'createdAt',
  //   'updatedAt',
  //   'userId',
  // ];

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
      as: 'content',
    });

    // save fetched contentable to dataValues
    // contentResponse.dataValues.contentable = contentResponse.contentable;

    // // save content data as new key on dataValues
    // contentResponse.dataValues.content = {
    //   id: contentResponse.id,
    //   latitude: contentResponse.latitude,
    //   longitude: contentResponse.longitude,
    //   upvotes: contentResponse.upvotes,
    //   placement: contentResponse.placement,
    //   contentableType: contentResponse.contentableType,
    //   contentableId: contentResponse.contentableId,
    //   parentId: contentResponse.parentId,
    //   createdAt: contentResponse.createdAt,
    //   updatedAt: contentResponse.updatedAt,
    //   userId: contentResponse.userId,
    // };

    // // delete the original 'content' kv's after adding them to new 'content' key
    // for (const key of contentKeys) {
    //   delete contentResponse.dataValues[key];
    // }

    return organizeContent(contentResponse);
  };

  try {
    // recursively lookup content with a parentId of the input Id and add that to the root object
    const getContentWithChildren = async (id) => {
      const root = await getById(id);

      const getChildren = async (node) => {
        // get children from Content table, using id of parent which has been added to "content" key
        const nodeChildren = await Content.findAll({
          where: { parentId: node.dataValues.content.id },
        });

        // if the node has children...
        if (nodeChildren.length > 0) {
          const nodeChildrenWithContentable = await Promise.all(
            nodeChildren.map(
              async (child) => await getById(child.dataValues.id)
            )
          );
          // assign new object to 'children' key
          node.dataValues.children = nodeChildrenWithContentable;

          // recursive case
          for (const childNode of node.dataValues.children) {
            await getChildren(childNode);
          }
        }
      };

      // start recursion
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

// get single piece of content by contentable type and id
ContentRouter.get(
  '/getContentable/type=:contentableType&id=:contentableId',
  async (req: Request, res: Response) => {
    const { contentableType, contentableId } = req.params;

    const pinKeys = [
      'id',
      'pinType',
      'photoURL',
      'description',
      'createdAt',
      'updatedAt',
    ];
    const commentKeys = ['id', 'description', 'createdAt', 'updatedAt'];
    const planKeys = [
      'id',
      'name',
      'title',
      'description',
      'address',
      'startTime',
      'endTime',
      'inviteCount',
      'attendingCount',
      'link',
      'createdAt',
      'updatedAt',
    ];
    const photoKeys = [
      'id',
      'description',
      'photoURL',
      'createdAt',
      'updatedAt',
    ];

    const organizeContentable = (contentableKeys, contentableResponse) => {
      // add new key 'contentable', delete original standalone kv's
      const contentableObject = {};
      for (const key of contentableKeys) {
        contentableObject[key] = contentableResponse.dataValues[key];
        delete contentableResponse.dataValues[key];
      }
      contentableResponse.dataValues.contentable = contentableObject;

      // add 'user' key from 'content' kv
      contentableResponse.dataValues.user = {
        ...contentableResponse.dataValues.content.user.dataValues,
      };

      // add 'tags' key from 'content' kv
      contentableResponse.dataValues.tags = [
        ...contentableResponse.dataValues.content.tags,
      ];

      delete contentableResponse.dataValues['content'].dataValues['user'];
      delete contentableResponse.dataValues['content'].dataValues['tags'];
      return contentableResponse;
    };

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
          contentableResponse = organizeContentable(
            pinKeys,
            contentableResponse
          );
          break;
        case 'photo':
          contentableResponse = await Photo.findByPk(
            Number(contentableId),
            includeOptions
          );
          contentableResponse = organizeContentable(
            photoKeys,
            contentableResponse
          );
          break;
        case 'plan':
          contentableResponse = await Plan.findByPk(
            Number(contentableId),
            includeOptions
          );
          contentableResponse = organizeContentable(
            planKeys,
            contentableResponse
          );
          break;
        case 'comment':
          contentableResponse = await Comment.findByPk(
            Number(contentableId),
            includeOptions
          );
          contentableResponse = organizeContentable(
            commentKeys,
            contentableResponse
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

// get all content shared with a user
ContentRouter.get(
  '/getSharedContent/:userId',
  async (req: Request, res: Response) => {
    const recipientId = Number(req.params.userId);

    try {
      // STEP 1: get all content shared with a user (recipient)
      const sharedContentResponse = await Shared_content.findAll({
        where: {
          recipientId,
        },
        include: [
          { model: User, as: 'sender' },
          {
            model: Content,
            include: [
              { model: Tag },
              { model: Shared_content_status },
              { model: User },
            ],
          },
        ],
        order: [['contentId', 'ASC']],
      });

      // STEP 2: get the contentable associated with each item of shared content. We can't include all contentable types in the previous db query because it returns a record from each contentable type (pin, comment, photo, plan) with the contentableId of contentId TODO: figure out how to achieve this with getContentable, a method of the Content model
      const sharedContentWithContentablesResponse = await Promise.all(
        sharedContentResponse.map(async (sharedContent) => {
          const contentId = sharedContent.dataValues.contentId;
          const contentableResponse = await Content.findByPk(contentId, {
            include: [Pin, Photo, Plan, Comment],
          });
          sharedContent.dataValues.contentable =
            contentableResponse.contentable;
          return sharedContent;
        })
      );

      // iterate over each piece of shared content and organize
      const sharedContentKeys = [
        'id',
        'contentId',
        'senderId',
        'recipientId',
        'createdAt',
        'updatedAt',
      ];

      // organize each piece of shared content in the response
      for (const [
        index,
        sharedContent,
      ] of sharedContentWithContentablesResponse.entries()) {
        // create new key containing info about contents' shares
        sharedContent.dataValues.sharedContentDetails = {
          senders: [
            {
              ...sharedContent.dataValues.sender.dataValues,
              shareTimeStamp: {
                id: sharedContent.dataValues.id,
                contentId: sharedContent.dataValues.contentId,
                senderId: sharedContent.dataValues.senderId,
                recipientId: sharedContent.dataValues.recipientId,
                createdAt: sharedContent.dataValues.createdAt,
                updatedAt: sharedContent.dataValues.updatedAt,
              },
            },
          ],
          sharedContentStatus:
            sharedContent.dataValues.content.dataValues
              .shared_content_statuses[0],
        };

        // the shared contents response is ordered by the contentId, so check to see if next content object has the same contentId as the target object, in which case add the share details of the later object to the target object and delete the later
        for (
          let i = index + 1;
          i < sharedContentWithContentablesResponse.length;
          i++
        ) {
          const target = sharedContent.contentId;
          const comp = sharedContentWithContentablesResponse[i].contentId;

          if (target === comp) {
            // add comp's sender and timestamp to the target's sharedContentDetails.senders array
            const senderObject = {
              ...sharedContentWithContentablesResponse[i].dataValues.sender
                .dataValues,
              shareTimeStamp: {
                id: sharedContentWithContentablesResponse[i].dataValues.id,
                contentId:
                  sharedContentWithContentablesResponse[i].dataValues.contentId,
                senderId:
                  sharedContentWithContentablesResponse[i].dataValues.senderId,
                recipientId:
                  sharedContentWithContentablesResponse[i].dataValues
                    .recipientId,
                createdAt:
                  sharedContentWithContentablesResponse[i].dataValues.createdAt,
                updatedAt:
                  sharedContentWithContentablesResponse[i].dataValues.updatedAt,
              },
            };
            // add details about the sender and timestamp from later shared content to target shared content's sender's array
            sharedContent.dataValues.sharedContentDetails.senders.push(
              senderObject
            );
            sharedContentWithContentablesResponse.splice(i, 1);
            i--; // back i up to account for splice
          } else if (target < comp) {
            // go to next iteration if we hit a higher contentId
            break;
          }
        }

        // move tags to first level
        sharedContent.dataValues.tags = [
          ...sharedContent.dataValues.content.dataValues.tags,
        ];

        // move user to first level
        sharedContent.dataValues.user =
          sharedContent.dataValues.content.dataValues.user;

        // delete old kv's
        delete sharedContent.dataValues.sender.dataValues;
        delete sharedContent.dataValues.content.dataValues
          .shared_content_statuses;
        delete sharedContent.dataValues.content.dataValues.tags;
        delete sharedContent.dataValues.content.dataValues.user;
        for (const key of sharedContentKeys) {
          delete sharedContent.dataValues[key];
        }
      }

      res.status(200).json(sharedContentWithContentablesResponse);
    } catch (e) {
      console.error('SERVER ERROR, failed to get shared content', e);
      res.status(500).send(e);
    }
  }
);

// get all content without a parent (ie, all "root" content); this route is called for home page content fetch
ContentRouter.get(
  '/getMainContent/userId=:userId&order=:order&category=:category',
  async (req: Request, res: Response) => {
    // eventually we'll be getting content based on who and where the user is
    const { userId, order, category } = req.params;

    try {
      console.log('req params', req.params);
      if (category === 'all') {
        const contentResponse = await Content.findAll({
          where: { parentId: null, placement: 'public' },
          include: [
            { model: User },
            { model: Tag },
            { model: Plan },
            { model: Pin },
            { model: Comment },
            { model: Photo },
          ],
          order: [[order, order === 'createdAt' ? 'ASC' : 'DESC']],
        });

        contentResponse.forEach((contentItem) => {
          organizeContent(contentItem);
        });

        res.send(contentResponse);
      } else if (category !== 'main') {
        // find the tag, include all records from content_tag join table
        const tagResponse = await Tag.findOne({
          where: {
            tag: category,
          },
          include: [
            {
              model: Content_tag,
              include: [
                {
                  model: Content,
                  include: [
                    { model: User },
                    { model: Tag },
                  ],
                },
              ],
            },
          ],
        });

        // Go get contentable for each piece of content from content_tag join table
        await Promise.all(
          tagResponse.dataValues.content_tags.map(async (contentItem) => {
            console.log('contentItem', contentItem.dataValues);
            const contentableResponse = await Content.findByPk(contentItem.contentId, {
              include: [Pin, Photo, Plan, Comment],
            });
            contentItem.dataValues.contentable =
            contentableResponse.contentable;

            // move nested user and tags out
            contentItem.dataValues.user = contentItem.dataValues.content.dataValues.user;
            contentItem.dataValues.tags = [...contentItem.dataValues.content.dataValues.tags]

            // delete content item's unneeded kv's
            delete contentItem.dataValues.content.dataValues.user;
            delete contentItem.dataValues.content.dataValues.tags;
            delete contentItem.dataValues.contentId;
            delete contentItem.dataValues.id
            delete contentItem.dataValues.tagId;
            delete contentItem.dataValues.createdAt;
            delete contentItem.dataValues.updatedAt;

          return contentItem;
          })
        );

        res.send(tagResponse.content_tags);
      }
    } catch (e) {
      console.error(e);
      res.send(501);
    }
  }
);

export default ContentRouter;
