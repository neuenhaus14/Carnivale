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
// AND isConfirmed is true.
// This route exists so only friend info
// can go to map, rather than all relationships
// featuring the user's id.
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
    if (allFriendships.length > 0) {
      // Of all the relationships of the user, get the friend (the non-user)
      const allFriendsIds = allFriendships.map((friendship: RelationshipModel) => {
        return friendship.requester_userId === Number(id) ? friendship.recipient_userId : friendship.requester_userId
      });
      // getting info of users: looking for all id's that are in allFriendsIds
      const allFriendsUsers: Array<Model> = await User.findAll({
        where: {
          id: {
            [Op.or]: [...allFriendsIds]
          }
        }
      })
      res.status(200).send(allFriendsUsers);
    } else { // else if allFriendships is empty...
      res.status(200).send([]) // send an empty array back, because they have no friends
    }
  } catch (err) {
    console.error('SERVER ERROR: could not GET friends', err);
    res.status(500).send(err);
  }
})

Friends.get('/getFriendRequests/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const requestsMade: Array<Model> = await Join_friend.findAll({
      where: {
        requester_userId: id,
        isConfirmed: null
      }
    })

    const requestsMadeIds = requestsMade.map((request: any) => {
      return request.recipient_userId
    })

    let requestsMadeUsers;
    if (requestsMadeIds.length > 0) {
      requestsMadeUsers = await User.findAll({
        where: {
          id: {
            [Op.or]: [...requestsMadeIds]
          }
        }
      });
    }

    const requestsReceived: Array<Model> = await Join_friend.findAll({
      where: {
        recipient_userId: id,
        isConfirmed: null
      }
    })

    const requestsReceivedIds = requestsReceived.map((request: any) => {
      return request.requester_userId
    })

    console.log('HEHERHERHEHRE', requestsMadeIds, requestsReceivedIds)

    // set the user objects array as undefined, and 
    // only assign if there are user objects to retrieve
    let requestsReceivedUsers;
    if (requestsReceivedIds.length > 0) {
      requestsReceivedUsers = await User.findAll({
        where: {
          id: {
            [Op.or]: [...requestsReceivedIds]
          }
        }
      });
    }

    console.log('here', requestsMadeUsers, requestsReceivedUsers)
    // if requests are still undefined (ie, don't pass the conditional
    // length check), then we'll return an empty array
    const response = {
      requestsMadeUsers: requestsMadeUsers || [],
      requestsReceivedUsers: requestsReceivedUsers || []
    }
    res.status(200).send(response);
  } catch (err) {
    console.error('SERVER ERROR: could not GET friend requests', err);
    res.status(500).send(err);
  }



})

// add a friend request from a user to a recipient (who is not a friend)
// all useful data are in request body
Friends.post('/requestFriend', async (req: Request, res: Response) => {

  const { requester_userId, recipient_phoneNumber } = req.body.friendRequest

  try {
    const userWithPhoneNumber: any = await User.findOne({ where: { phone: recipient_phoneNumber } })
    console.log('uWPN', userWithPhoneNumber);
    if (userWithPhoneNumber === null) {
      res.status(404).send('No user with that phone number')
    } else {
      const newRelationship: Model = await Join_friend.create({ requester_userId, recipient_userId: userWithPhoneNumber.id, isConfirmed: null })
      res.status(201).send(newRelationship)
    }
  } catch (err) {
    console.error('SERVER ERROR: could not POST friend request', err);
    res.status(500).send(err);
  }
})

// accept or reject a friend request, will update relationship 
// eventually add some kind of thing that disallows 
Friends.patch('/answerFriendRequest', async (req: Request, res: Response) => {

  const { requester_userId, recipient_userId, isConfirmed } = req.body.answer;

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

// cancel friend request
Friends.delete('/cancelFriendRequest/:requester_userId-:recipient_userId', async (req: Request, res: Response) => {
  const { requester_userId, recipient_userId } = req.params;

  try {
    const deleteRecord = await Join_friend.destroy({
      where: {
        requester_userId,
        recipient_userId,
        isConfirmed: null,
      }
    })
    if (deleteRecord > 0) {
      res.status(200).send('Friend request deleted');
    } else {
      res.status(404).send()
    }
  } catch (err) {
    console.error("SERVER ERROR: could not DELETE friend request", err);
    res.status(500).send(err);
  }
})


// unfriend
Friends.delete('/unfriend/:userId-:friendId', async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const deleteRecord = await Join_friend.destroy({
      where: {
        requester_userId: {
          [Op.or]: [userId, friendId]
        },
        recipient_userId: {
          [Op.or]: [userId, friendId]
        },
        isConfirmed: true
      }
    })

    if (deleteRecord > 0) {
      res.status(200).send('Friendship deleted')
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.error("SERVER ERROR: could not DELETE friendship", err);
    res.status(500).send(err);
  }


})


export default Friends;
