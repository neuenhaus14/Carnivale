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

// NEXT THREE ROUTES SEARCH FOR PRIVATE!!! EVENTS BY USERNAME
Events.get('/getEventsOwned/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userEventsOwned: any = await Event.findAll({
      where: {
        ownerId: userId
      },
      order: [
        ['startTime', 'ASC']
      ]
    })
    console.log('userEventsOwned', userEventsOwned)
    res.status(200).send(userEventsOwned);

  } catch (err) {
    console.error('SERVER ERROR: failed to GET events owned by user', err);
    res.status(500).send(err);
  }
})


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
          id: userEventsParticipatingIds,
          // id: {
          //   [Op.or]: [...userEventsParticipatingIds]
          // },
          [Op.or]: [
            {
              ownerId: {
                [Op.not]: userId
              }
            },
            {
              ownerId: null
            }
          ]
        },
        order: [
          ['startTime', 'ASC']
        ]
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
      // console.log('No event invitations')
      res.status(200).send([])
    } else {

      const userEventsInvitedIds = userEventsInvitedRecords.map((record: any) => record.eventId)

      const userEventsInvited: any = await Event.findAll({
        where: {
          id: {
            [Op.or]: [...userEventsInvitedIds]
          }
        },
        order: [
          ['startTime', 'ASC']
        ]
      })
      res.status(200).send(userEventsInvited);
    }
  } catch (err) {
    console.error('SERVER ERROR: failed to GET events you are invited to', err);
    res.status(500).send(err);
  }
})

// NEXT TWO GET ARRAY OF PUBLIC EVENT ID's FOR A USER
Events.get('/getPublicEventsParticipating/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // join records with user's id
    const userEventsParticipatingRecords: any = await Join_user_event.findAll({
      where: {
        userId,
        isAttending: true,
      }
    });
    // console.log('user events participating', userId, userEventsParticipatingRecords)
    // if user has no events that they're going to
    if (userEventsParticipatingRecords.length === 0) {
      console.log('No user event participation records')
      // send empty array
      res.status(200).send([]);
    } else {
      const userEventsParticipatingIds = userEventsParticipatingRecords.map((record: any) => record.eventId);

      const userPublicEventsParticipating: any = await Event.findAll({
        where: {
          id: {
            [Op.or]: [...userEventsParticipatingIds]
          },
          ownerId: null,
          system: true
        }
      });
      // console.log('array of public participating events ids', userPublicEventsParticipating.map((event: any) => event.id))
      res.status(200).send(userPublicEventsParticipating.map((event: any) => event.id));
    }
  } catch (err) {
    console.error('SERVER ERROR: failed to GET public events the user is going to', err);
    res.status(500).send(err);
  }
})

Events.get('/getPublicEventsInvited/:userId', async (req: Request, res: Response) => {
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
      // console.log('No event invitations')
      res.status(200).send([])
    } else {

      const userEventsInvitedIds = userEventsInvitedRecords.map((record: any) => record.eventId)

      const userPublicEventsInvited: any = await Event.findAll({
        where: {
          id: {
            [Op.or]: [...userEventsInvitedIds]
          },
          system: true,
        }
      })
      res.status(200).send(userPublicEventsInvited.map((event: any) => event.id));
    }
  } catch (err) {
    console.error('SERVER ERROR: failed to GET public events the user is invited to', err);
    res.status(500).send(err);
  }
})

// GET ALL PUBLIC EVENTS
Events.get('/getAllPublicEvents', async (req: Request, res: Response) => {

  try {
    const allPublicEvents = await Event.findAll({
      where: {
        system: true
      },
      order: [
        ['startTime', 'ASC']
      ]
    })
    res.status(200).send(allPublicEvents)
  } catch (err) {
    console.error('SERVER ERROR: failed to GET all public events', err)
    res.status(500).send(err)
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
        eventParticipants: eventParticipants.map((participationRecord: any) => participationRecord.userId),
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
// created it), and join_event_invitees (array of user id's (numbers) who
// are friends).
Events.post('/createEvent', async (req: Request, res: Response) => {
  const {


    name,
    startTime,
    endTime,
    description,
    longitude,
    latitude,
    address,
    link,
    system,
    invitees,
    invitedCount,
    attendingCount,
    upvotes,
    ownerId,
   } = req.body.event;


  try {
    // figure out how to type this properly
    // how do interfaces get passed from
    // db's index.js? Event interface is created,
    // but not working
    const newEvent: any = await Event.create({
      ownerId,
      name,
      description,
      longitude,
      latitude,
      address,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      system,
      link,
      invitedCount,
      attendingCount
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

Events.patch('/updateEvent', async (req: Request, res: Response) => {
  try {
  const {
    id,
    name,
    startTime,
    endTime,
    description,
    longitude,
    latitude,
    address,
    //link,
    //system,
    //invitees,
    //invitedCount,
    //attendingCount,
    //upvotes,
    //ownerId,
   } = req.body.event;

     const updatedEvent = await Event.update({name, startTime, endTime, description, longitude, latitude, address}, {
      where : {
        id
      }
     })

     console.log('updatedEvent', updatedEvent);



     res.status(200).send(updatedEvent)
    } catch (err) {
      console.error('SERVER ERROR: failed to PATCH event', err);
      res.status(500).send(err);
    }
})




// request will have instructions whether to attend or not, invitee_userId and eventId
// The record inside JOIN_EVENT_INVITEES gets deleted every time--will need to refactor
// to be able to change your mind after RSVP'ing
Events.post('/setEventAttendance', async (req: Request, res: Response) => {
  const { eventId, userId, isAttending } = req.body.answer

  try {
    let updatedCount: any = await Join_user_event.update({ isAttending }, {
      where: {
        eventId,
        userId
      }
    })
    if (updatedCount[0] === 0) {
      updatedCount = await Join_user_event.create({
        eventId,
        userId,
        isAttending,
      })
    }
    // console.log('uC', updatedCount);
    res.status(201).send(updatedCount)
  } catch (err) {
    console.error("SERVER ERROR: could not POST event answer", err);
    res.status(500).send(err);
  }
})

Events.delete('/deleteEvent/:eventId', async (req: Request, res: Response) => {
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
// Events.get('/trial-endpoint', async (req: Request, res: Response) => {
//   console.log('Trial endpoint')
//   res.status(201).send('Connected in trial endpoint')
// })
Events.post('/getCoordinatesFromAddress', async (req: Request, res: Response) => {

  const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const apiUrlEnd = '.json?proximity=ip&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw';
  try {
    let { address } = req.body
    address = address.replaceAll(' ', '%20');
    const apiUrl = apiUrlBeginning + address + apiUrlEnd;
    const coordinateResponse: any = await axios.get(apiUrl).catch((error) => console.error(error));
    const coordinates = coordinateResponse.data.features[0].center;
    console.log('address success')
    res.status(200).send(coordinates);
  } catch (err) {
    console.error("SERVER ERROR: failed to 'POST' new coordinates from address", err);
    res.status(500).send(err);
  }
})

Events.post('/getAddressFromCoordinates', async (req: Request, res: Response) => {
  const { latitude, longitude } = req.body.coordinates

  const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const apiUrlEnd = '.json?proximity=ip&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw';
  const coordinateString = `${longitude},${latitude}`
  const apiUrl = apiUrlBeginning + coordinateString + apiUrlEnd

  const addressResponse: any = await axios.get(apiUrl).catch((error) => console.error(error));
  const address = addressResponse.data.features[0].place_name;

  res.status(200).send(address);
})


export default Events;