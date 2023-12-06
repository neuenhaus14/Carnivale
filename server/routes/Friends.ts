import { Router, Request, Response } from "express";
import { Join_friend, User } from "../db";
import { Op, Model } from "sequelize";
const Friends = Router();



interface RelationshipModel extends Model {
  id: number,
  isConfirmed: boolean,
  requester_userId: number,
  recipient_userId: number,
  createdAt: Date,
  updatedAt: Date,
}


// Checks friends join table
// and returns all User records where
// id is either request or recipient 
// AND isConfirmed is true
Friends.get('/getFriends/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    // getting relationships where friendship is confirmed
    const allFriendships: Array<Model> = await Join_friend.findAll({
      where: {
        [Op.or]: [
          { requester_userId: id },
          { recipient_userId: id }
        ],
        isConfirmed: true, // isConfirmed indicates the recipient has accepted the request
      }
    })

    // make sure we have relationships before
    // going and getting the user info
    if (allFriendships) {
      // Of all the relationships of the user, get the friend (the non-user)
      const allFriendsIds = allFriendships.map((friendship: RelationshipModel) => {
        return friendship.requester_userId === Number(id) ? friendship.recipient_userId : friendship.requester_userId
      });
      // getting info of users: looking for all id's that are in allFriendsIds
      const allFriendsProfiles: Array<Model> = await User.findAll({
        where: {
          id: {
            [Op.or]: [...allFriendsIds]
          }
        }
      })
      res.status(200).send(allFriendsProfiles);
    } else { // else if allFriendships is empty...
      res.status(404).send('Resource not found. You have no friends.')
    }
  } catch (err) {
    console.error('SERVER ERROR: could not GET friends', err);
    res.status(500).send(err);
  }
})

// add a friend request from a user to a recipient (who is not a friend)
// all useful data are in request body
Friends.post('/requestFriend', async (req: Request, res: Response) => {

  const { requester_userId, recipient_userId } = req.body.friendRequest

  try {
    const newRelationship: Model = await Join_friend.create({ requester_userId, recipient_userId, isConfirmed: null })
    res.status(201).send(newRelationship)
  } catch (err) {
    console.error('SERVER ERROR: could not POST friend request', err);
    res.status(500).send(err);
  }
})

// accept or reject a friend request, will update relationship 
// eventually add some kind of thing that disallows 
Friends.patch('/answerFriendRequest', async (req: Request, res: Response) => {

  const { requester_userId, recipient_userId, isConfirmed } = req.body.friendRequestAnswer;

  try {
    const updatedRelationship = await Join_friend.update({ isConfirmed: isConfirmed }, {
      where: {
        requester_userId,
        recipient_userId,
      }
    })
    res.status(200).send(updatedRelationship)
  } catch (err) {
    console.error('SERVER ERROR: could not PATCH friend request', err);
    res.status(500).send(err);
  }
})


export default Friends;
