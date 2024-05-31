import { Request, Response, Router } from 'express';

import models from '../db/models/index';
import { Op } from 'sequelize';

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
const User_friend = models.user_friend;

const ContentRouter = Router();

ContentRouter.get('/getTest', (req: Request, res: Response) => {
  res.status(200).send('Booyah');
});


/*
All content needs to get organized for the front end like this:

{
  content: {
    ...
  }
  contentable: {
    ...
  }
  tags: [{...},{...}],
  user: {
    ...
  }
}

Check the types file to see a further breakdown of what properties are contained in each key.
*/

// This function organizes any record returned from the Content table that has its Contentable included
const organizeContent = (contentObject) => {
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

  contentObject.dataValues.contentable = contentObject.contentable;

  // save content data as new key on dataValues
  contentObject.dataValues.content = {
    id: contentObject.id,
    latitude: contentObject.latitude,
    longitude: contentObject.longitude,
    upvotes: contentObject.upvotes,
    placement: contentObject.placement,
    contentableType: contentObject.contentableType,
    contentableId: contentObject.contentableId,
    parentId: contentObject.parentId,
    createdAt: contentObject.createdAt,
    updatedAt: contentObject.updatedAt,
    userId: contentObject.userId,
  };

  // delete the original 'content' kv's after adding them to new 'content' key
  for (const key of contentKeys) {
    delete contentObject.dataValues[key];
  }

  return contentObject;
};

// This function organizes a pin
const organizePin = (pinObject) => {
  const pinKeys = [
    'id',
    'pinType',
    'description',
    'latitude',
    'longitude',
    'createdAt',
    'updatedAt',
    'photoURL',
  ];

  // create 'contentable' k-v
  pinObject.dataValues.contentable = {
    id: pinObject.id,
    pinType: pinObject.pinType,
    description: pinObject.description,
    latitude: pinObject.latitude,
    longitude: pinObject.longitude,
    createdAt: pinObject.createdAt,
    upDatedAt: pinObject.updatedAt,
    photoURL: pinObject.photoURL,
  }

  // delete the original 'pin' kv's after adding them to new 'contentable' key
  for (const key of pinKeys) {
    delete pinObject.dataValues[key];
  }

  // move user and tags from inside content property
  pinObject.dataValues.user = pinObject.content.user;
  pinObject.dataValues.tags = pinObject.content.tags;
  delete pinObject.content.dataValues.tags;
  delete pinObject.content.dataValues.user;


  return pinObject;
}

// get single piece of content with nested thread
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

// get all content for feed page
ContentRouter.get(
  '/getFeedPageContent/:userId',
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    try {
      ///////////////////////////////////
      // CHAPTER 1: GET SHARED CONTENT
      ///////////////////////////////////

      // STEP 1: get all content shared with a user (recipient)
      const sharedContentResponse = await Shared_content.findAll({
        where: {
          recipientId: userId,
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

      // STEP 3: Iterate over each piece of shared content and organize

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
        const sharedContentKeys = [
          'id',
          'contentId',
          'senderId',
          'recipientId',
          'createdAt',
          'updatedAt',
        ];
        for (const key of sharedContentKeys) {
          delete sharedContent.dataValues[key];
        }
      }

      ///////////////////////////////////
      // CHAPTER 2: GET FRIENDS' CONTENT
      ///////////////////////////////////

      // Step1: get friendships
      const userFriendships = await User_friend.findAll({
        where: {
          [Op.or]: {
            requesterId: userId,
            recipientId: userId,
          },
          status: 'accepted',
        },
      });

      // sort out to get just friend ids
      const userFriendIds = userFriendships.map((friendship) => {
        if (friendship.dataValues.recipientId === userId) {
          return friendship.dataValues.requesterId;
        } else {
          return friendship.dataValues.recipientId;
        }
      });

      // get the public content of those friends
      const friendsContent = await Content.findAll({
        where: {
          userId: { [Op.in]: userFriendIds },
          placement: 'public'
        },
        include: [
          { model: User },
          { model: Tag },
          { model: Plan },
          { model: Pin },
          { model: Comment },
          { model: Photo },
        ],
      });

      friendsContent.forEach((contentObject) => {
        organizeContent(contentObject);
      });

      // go get the pending friendships that user needs to respond to
      const pendingFriendships = await User_friend.findAll({
        where: {
          [Op.or] : [{recipientId: userId}, {requesterId: userId}],
          status: 'pending',
        },
        include: [{association: 'requester'}, {association: 'recipient'}]
      });

      ///////////////////////////////////
      // CHAPTER 3: GET MY CONTENT
      // (INCLUDING FRIEND INVITE INFO)
      ///////////////////////////////////

      const myContent = await Content.findAll({
        where: {
          userId,
        },
        include: [
          { model: User },
          { model: Tag },
          { model: Plan },
          { model: Pin },
          { model: Comment },
          { model: Photo },
        ],
      });

      myContent.forEach((contentObject) => {
        organizeContent(contentObject);
      });

      const responseObject = {
        sharedContent: sharedContentWithContentablesResponse,
        friendsContent: friendsContent,
        friendRequests: pendingFriendships,

        myContent,
      };

      res.status(200).json(responseObject);
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

        contentResponse.forEach((contentObject) => {
          organizeContent(contentObject);
        });

        res.send(contentResponse);
      } else if (category !== 'all') {
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
                  include: [{ model: User }, { model: Tag }],
                },
              ],
            },
          ],
        });

        // Go get contentable for each piece of content from content_tag join table
        await Promise.all(
          tagResponse.dataValues.content_tags.map(async (contentObject) => {
            const contentableResponse = await Content.findByPk(
              contentObject.contentId,
              {
                include: [Pin, Photo, Plan, Comment],
              }
            );
            contentObject.dataValues.contentable =
              contentableResponse.contentable;

            // move nested user and tags out
            contentObject.dataValues.user =
              contentObject.dataValues.content.dataValues.user;
            contentObject.dataValues.tags = [
              ...contentObject.dataValues.content.dataValues.tags,
            ];

            // delete content item's unneeded kv's
            delete contentObject.dataValues.content.dataValues.user;
            delete contentObject.dataValues.content.dataValues.tags;
            delete contentObject.dataValues.contentId;
            delete contentObject.dataValues.id;
            delete contentObject.dataValues.tagId;
            delete contentObject.dataValues.createdAt;
            delete contentObject.dataValues.updatedAt;

            return contentObject;
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

// get all pins for map page
ContentRouter.get('/getAllPins', async (req: Request, res:Response) => {
  try {
    const allPinsResponse = await Pin.findAll({include: [{ model: Content, include: [Tag, User] }]});

    allPinsResponse.forEach((pinObject) => {
      organizePin(pinObject);
    });

    res.status(200).send(allPinsResponse);
  } catch (e) {
    console.error('SERVER ERROR: failed to get all pins', e);
    res.status(500).send(e);
  }
})

export default ContentRouter;
