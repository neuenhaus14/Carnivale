import { Router, Request, Response } from "express";
import { Event, Join_event_invitee, Join_event_participant } from "../db";
import { Model, InferCreationAttributes, InferAttributes, CreationOptional } from 'sequelize';

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

Events.get('/getEventsAttending/:id', (req: Request, res: Response) => {
  console.log('getEventsAttending')
})

Events.get('/getEventsInvited/:id', (req: Request, res: Response) => {
  console.log('getEventsInvited')
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
    const newParticipantRecord: any = await Join_event_participant.create({eventId: newEvent.id, participant_userId: newEvent.ownerId})

    // map over invitees from request to make objects that
    // can be bulk created in invitees join table
    const inviteeArray = invitees.map((invitee: number) => {
     return  { invitee_userId: invitee, eventId: newEvent.id }
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




export default Events;