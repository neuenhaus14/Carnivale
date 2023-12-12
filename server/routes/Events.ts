import { Router, Request, Response } from "express";
import { Event, Join_friend, Join_user_event } from "../db";
import { Model, InferCreationAttributes, InferAttributes, CreationOptional, Op } from 'sequelize';
import axios from "axios";

// interface EventModel extends Model {
//   id: number,
//   ownerId: number,
//   name: string,
//   description: string,
//   longitude: number,
//   latitude: number,
//   address: string
//   startTime: Date,
//   endTime: Date,
//   system: boolean,
//   link: string,
//   invitedCount: number,
//   attendingCount: number,
//   createdAt: Date,
//   updatedAt: Date,
// }

const Events = Router();

// NEXT TWO ROUTES SEARCH FOR EVENTS BY USERNAME
Events.get('/getEventsParticipating/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // join records with user's id
    const userEventsParticipatingRecords: any = await Join_user_event.findAll({
      where: {
        userId,
        isAttending: true,
      }
    });

    // if user has no events that they're going to
    if (userEventsParticipatingRecords.length === 0) {
      // send empty array
      res.status(200).send([]);
    } else {
      const userEventsParticipatingIds = userEventsParticipatingRecords.map((record: any) => record.eventId);

      const userEventsParticipating: any = await Event.findAll({
        where: {
          id: {
            [Op.or]: [...userEventsParticipatingIds]
          }
        }
      });
      res.status(200).send(userEventsParticipating);
    }
  } catch (err) {
    console.error('SERVER ERROR: failed to GET events you are going to', err);
    res.status(500).send(err);
  }
})

Events.get('/getEventsInvited/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {

  // join records with user's id
  const userEventsInvitedRecords: any = await Join_user_event.findAll({
    where: {
      userId,
      isAttending: false,
    }
  })
  // if user has no events that they're invited to...
  if (userEventsInvitedRecords.length === 0) {
    console.log('No event invitations')
    res.status(200).send([])
  } else {

    const userEventsInvitedIds = userEventsInvitedRecords.map((record: any) => record.eventId)

    const userEventsInvited: any = await Event.findAll({
      where: {
        id: {
          [Op.or]: [...userEventsInvitedIds]
        }
      }
    })
    res.status(200).send(userEventsInvited);
  }
} catch (err) {
  console.error('SERVER ERROR: failed to GET events you are invited to', err);
  res.status(500).send(err);
}
})

// get friends that are attending provided a user and event
Events.get('/getPeopleForEvent/:userId-:eventId', async (req: Request, res: Response) => {
  const { userId, eventId } = req.params;

  try {
    const allFriendships = await Join_friend.findAll({
      where: {
        isConfirmed: true,
        [Op.or]: [
          { requester_userId: userId },
          { recipient_userId: userId }
        ]
      }
    })

     // make sure we have relationships before
    // going and getting the user info
    if (allFriendships.length > 0) {
      // Of all the relationships of the user, get the friend (the non-user)
      const allFriendsIds = allFriendships.map((friendship: any) => {
        return friendship.requester_userId === Number(userId) ? friendship.recipient_userId : friendship.requester_userId
      });

    const eventParticipants = await Join_user_event.findAll({
      where: {
        eventId,
        userId: {
          [Op.or]: [...allFriendsIds]
        },
        isAttending: true,
      }
    })
  
    const eventInvitees = await Join_user_event.findAll({
      where: {
        eventId,
        userId: {
          [Op.or]: [...allFriendsIds]
        },
        isAttending: false,
      }
    })

    // map over results to just return the ids of the friends attending
    const response = {
      eventParticipants: eventParticipants.map((participationRecord : any) => participationRecord.userId),
      eventInvitees: eventInvitees.map((inviteRecord: any) => inviteRecord.userId)
    }

    res.status(200).send(response);
  } else { // if they don't have any friends, send back empty arrays
    const response: any = {
      eventParticipants: [],
      eventInvitees: []
    }
    res.status(200).send(response)
  }
} catch (err) {
    console.error('SERVER ERROR: failed to GET people involved with event', err);
    res.status(500).send(err);
  }
})

// creating an event from user events page updates events
// (many fields, new entry), join_event_participants (whoever
// created it), and join_event_invitees (array of user id's (numbers) who 
// are friends). 
Events.post('/createEvent', async (req: Request, res: Response) => {
  const {
    ownerId, name, description,
    longitude, latitude, address,
    startTime, endTime, system, link,
    invitees, invitedCount, attendingCount } = req.body.event;

  try {
    // figure out how to type this properly
    // how do interfaces get passed from 
    // db's index.js? Event interface is created,
    // but not working
    const newEvent: any = await Event.create({
      ownerId, name, description,
      longitude, latitude, address,
      startTime: new Date(startTime),
      endTime: new Date(endTime), system, link,
      invitedCount, attendingCount
    })

    // add owner of event to participants
    const newParticipantRecord: any = await Join_user_event.create({ 
      eventId: newEvent.id, 
      userId: newEvent.ownerId,
      isAttending: true,
    })

    // map over invitees from request to make objects that
    // can be bulk created in invitees join table
    const inviteeArray = invitees.map((invitee: number) => {
      return { 
        userId: invitee, 
        eventId: newEvent.id, 
        isAttending: false,
      }
    })
    const newInviteeRecord: any = await Join_user_event.bulkCreate(inviteeArray)

    // confirmation response containing all info
    const response = {
      event: newEvent,
      attending: newParticipantRecord,
      invited: newInviteeRecord
    }

    res.status(200).send(response);

  } catch (err) {
    console.error("SERVER ERROR: could not POST event", err);
    res.status(500).send(err)
  }
})

// request will have instructions whether to attend or not, invitee_userId and eventId
// The record inside JOIN_EVENT_INVITEES gets deleted every time--will need to refactor
// to be able to change your mind after RSVP'ing
Events.post('/setEventAttendance', async (req: Request, res: Response) => {
  const { eventId, userId, isAttending } = req.body.answer

  try{
    const updatedCount = await Join_user_event.update({ isAttending }, {
      where: {
        eventId,
        userId
      }
    })
    res.status(201).send(updatedCount)
  } catch (err) {
    console.error("SERVER ERROR: could not POST event answer", err);
    res.status(500).send(err);
  }
})

Events.delete('/deleteEvent/:eventId', async (req: Request, res: Response)=> {
  const { eventId } = req.params;

  try {
    // delete user-event records before event, since invite references event
    const deletedUserRecordsCount = await Join_user_event.destroy({
      where: {
        eventId
      }
    })

    const deletedEventCount = await Event.destroy({
      where: {
        id: eventId
      }
    })
    const response = {
      deletedEventCount: deletedEventCount,
      deletedUserRecordsCount: deletedUserRecordsCount,
    }

    res.status(202).send(response);

  } catch (err) {
    console.error("SERVER ERROR: could not DELETE event records", err);
    res.status(500).send(err);
  }


})

Events.post('/inviteToEvent', async (req: Request, res: Response) => {
  // invitees is array of userIds
  const { eventId, invitees } = req.body.invitations;

  try {
    const invitations: any = invitees.map((userId: number) => {
      return { eventId, userId, isAttending: false }
    })
    const invitationsResponse = await Join_user_event.bulkCreate(invitations);
    res.status(201).send(invitationsResponse)
  } catch (err) {
    console.error("SERVER ERROR: could not POST event invitations", err);
    res.status(500).send(err);
  }
})



export default Events;