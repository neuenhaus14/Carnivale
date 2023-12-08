import { Router, Request, Response } from "express";
import { Event, Join_event_invitee, Join_event_participant } from "../db";
import { Model, InferCreationAttributes, InferAttributes, CreationOptional, Op } from 'sequelize';

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

Events.get('/getEventsParticipating/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // join records with user's id
    const userEventsParticipatingRecords: any = await Join_event_participant.findAll({
      where: {
        participant_userId: id
      }
    });

    // if user has no events that they're going to
    if (userEventsParticipatingRecords.length === 0) {
      console.log('No events attending');
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
      // console.log('getEventsAttending', userEventsParticipating);
      res.status(200).send(userEventsParticipating);
    }
  } catch (err) {
    console.error('SERVER ERROR: failed to GET events you are going to', err);
    res.status(500).send(err);
  }
})

Events.get('/getEventsInvited/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {

  // join records with user's id
  const userEventsInvitedRecords: any = await Join_event_invitee.findAll({
    where: {
      invitee_userId: id
    }
  })
  console.log('Here', userEventsInvitedRecords)
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
    console.log('getEventsInvited', userEventsInvited)
    res.status(200).send(userEventsInvited);
  }
} catch (err) {
  console.error('SERVER ERROR: failed to GET events you are invited to', err);
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
    const newParticipantRecord: any = await Join_event_participant.create({ eventId: newEvent.id, participant_userId: newEvent.ownerId })

    // map over invitees from request to make objects that
    // can be bulk created in invitees join table
    const inviteeArray = invitees.map((invitee: number) => {
      return { invitee_userId: invitee, eventId: newEvent.id }
    })
    const newInviteeRecord: any = await Join_event_invitee.bulkCreate(inviteeArray)

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
Events.post('/answerEventInvite', async (req: Request, res: Response) => {
  const { eventId, invitee_userId, isGoing } = req.body.answer

  try{
    // init this var, which will be assigned if the user confirms the invitation
    let eventParticipating: any = null;
    
    // if the user RSVP's to an event they're invited to, add
    // record to event_participant table, 
    if (isGoing === true) {
      eventParticipating = await Join_event_participant.create({
        eventId, participant_userId: invitee_userId
      })
    }
    // always delete the record of the 
    // invitation after an answer is provided
    const eventInviteDeletion: any = await Join_event_invitee.destroy({
      where: {
        eventId, invitee_userId
      }
    })
    // send info below back to client: the record added to Join_events_participants
    // and the number of records deleted from Join_event_invitee
    const response = {
      participating: eventParticipating,
      invitesRemoved: eventInviteDeletion,
    }
    res.status(201).send(response)
  } catch (err) {
    console.error("SERVER ERROR: could not POST event answer", err);
    res.status(500).send(err);
  }
})

Events.delete('/deleteEvent/:eventId', async (req: Request, res: Response)=> {
  const { eventId } = req.params;

  try {
    // delete invites before event, since invite references event
    const deletedInvites = await Join_event_invitee.destroy({
      where: {
        eventId
      }
    })
    const deletedParticipants = await Join_event_participant.destroy({
      where: {
        eventId
      }
    })

    const deletedEvent = await Event.destroy({
      where: {
        id: eventId
      }
    })
    const response = {
      deletedEventCount: deletedEvent,
      deletedInviteCount: deletedInvites,
      deletedParticipants: deletedParticipants,
    }

    console.log('dE', deletedEvent, 'dI', deletedInvites, 'dP', deletedParticipants);
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
    const invitations: any = invitees.map((invitee_userId: number) => {
      return { eventId, invitee_userId }
    })
    const invitationsResponse = await Join_event_invitee.bulkCreate(invitations);

    console.log('here', invitationsResponse)
    res.status(201).send(invitationsResponse)

  } catch (err) {
    console.error("SERVER ERROR: could not POST event invitations", err);
    res.status(500).send(err);
  }
})



export default Events;