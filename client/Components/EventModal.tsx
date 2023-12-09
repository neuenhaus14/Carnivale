import React, { useState } from 'react';
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
}



// MAYBE ADD A useEffect THAT FETCHES WHO'S ATTENDING
// AN EVENT WHENEVER SELECTED EVENT CHANGES

const EventInviteAccordion: React.FC<EventInviteAccordionProps> = ({ friends, selectedEvent }) => {

  const inviteFriend = (invitee_userId: number, eventId: number) => {
    console.log('inside invite friend', invitee_userId, eventId);
  }


  const friendsItems = friends.map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} <button onClick={()=> inviteFriend(friend.id, selectedEvent.id)}>Invite</button></li>
  })

  console.log('friends from inside accordion', friends);
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

const EventModal: React.FC<EventModalProps> = ({ selectedEvent, setShowModal, showModal, setSelectedEvent, friends }) => {
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
        <EventInviteAccordion selectedEvent={selectedEvent} friends={friends} />
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