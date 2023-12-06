import { Router, Request, Response } from "express";

const Events = Router();

Events.get('/getEventsAttending/:id', (req: Request, res: Response) => {
  console.log('getEventsAttending')
})

Events.get('/getEventsInvited/:id', (req: Request, res: Response) => {
  console.log('getEventsInvited')
})

// creating an event from user events page updates events
// (many fields, new entry), join_event_participants (whoever
// created it), and join_event_invitees (array of users who 
// are friends). 


Events.post('/createEvent', (req: Request, res: Response) => {
  const { 
    ownerId, name, description,
    longitude, latitude, address,
     time, system, link, invitees } = req.body.event;


  console.log('createEvents', req.body.event)
})




export default Events;