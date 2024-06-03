import axios from "axios";

import { Response, Request } from "express";


// TODO: is REDIRECT_URL the best way forward here? Is there something is axios config that allows us to set endpoint without writing it in?
import { REDIRECT_URL } from "../config";

// Tags are created after the content is already saved to DB. contentId will be parsed from the content creation response from sequelize: we have to create the content before tags are added to it
export const createTags = async (contentId, tags) => {
  await Promise.all(tags.map(async (tag) => {
    await axios.post(`${REDIRECT_URL}/api/tags/addTag` , {
      contentId,
      tag
    })
  }))
}

// Content is shared after the the content is created. FriendsToShareWith is an array of user ids
export const shareContent = async (friendsToShareWith, contentId, senderId) => {
  await Promise.all(friendsToShareWith.map(async (friendId)=> {
    await axios.post(`${REDIRECT_URL}/api/sharedContent/addSharedContent`, {
      contentId,
      senderId,
      recipientId: friendId,
    })
  }))
}

export const runMiddleware = (req: Request, res: Response, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}