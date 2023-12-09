import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap'
import EventMapComponent from './EventMapComponent';
import axios from 'axios';

interface EventModalProps {
  selectedEvent: any,
  setSelectedEvent: any,
  setShowModal: any,
  showModal: boolean,
  friends: any,
  userId: number,
}

interface EventInviteAccordionProps {
  friends: any,
  selectedEvent: any,
  userId: number
}



// MAYBE ADD A useEffect THAT FETCHES WHO'S ATTENDING
// AN EVENT WHENEVER SELECTED EVENT CHANGES



const EventInviteAccordion: React.FC<EventInviteAccordionProps> = ({ friends, selectedEvent, userId }) => {

  // TODO: on a checkmark, add an uninvited friend to the invitees array
  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);
  

  useEffect(()=> {
    getPeopleForEvent()
  }, [])

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  const getPeopleForEvent = async () => {
    const eventPeopleData = await axios.get(`/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`);
    const { eventParticipants , eventInvitees } = eventPeopleData.data;
    setInvitees(eventInvitees);
    setParticipants(eventParticipants)
  }

  // TODO: display user friends according to 
  // their attending the event
  const inviteFriend = (invitee_userId: number, eventId: number) => {
    console.log('inside invite friend', invitee_userId, eventId);
  }

  const friendsItems = friends.map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} <button onClick={()=> inviteFriend(friend.id, selectedEvent.id)}>Invite</button></li>
  })

  console.log('inside event modal accordion. i:', invitees, 'p', participants);
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Invite your friends</Accordion.Header>
        <Accordion.Body>
          <ul>
            {friendsItems}
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

const EventModal: React.FC<EventModalProps> = ({ selectedEvent, setShowModal, showModal, setSelectedEvent, friends, userId }) => {
  const handleClose = () => {
    setShowModal(false); // goes up to user page and sets to false
    setSelectedEvent({});
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <EventMapComponent /> */}
        Woohoo, you are reading this text in a modal!
        <p>{selectedEvent.name}</p>
        <EventInviteAccordion 
          selectedEvent={selectedEvent} 
          friends={friends} 
          userId={userId}
          />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )

};

export default EventModal;