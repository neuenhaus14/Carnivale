import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap'
import EventBasicMapComponent from './EventBasicMapComponent';
import axios from 'axios';

// This modal displays for events that the user
// is invited to and attending
// you can only invite other people if you're
// already attending



interface EventBasicModalProps {
  selectedEvent: any,
  setSelectedEvent: any,
  setShowBasicModal: any,
  showBasicModal: boolean,
  friends: any,
  userId: number,
  isUserAttending: boolean,
  setIsUserAttending: any,
  getEventsInvited: any,
  getEventsParticipating: any,
}

interface EventBasicAccordionProps {
  friends: any,
  selectedEvent: any,
  userId: number
  isUserAttending: boolean
}



// MAYBE ADD A useEffect THAT FETCHES WHO'S ATTENDING
// AN EVENT WHENEVER SELECTED EVENT CHANGES



const EventBasicAccordion: React.FC<EventBasicAccordionProps> = ({ friends, selectedEvent, userId, isUserAttending }) => {

  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [friendsToInvite, setFriendsToInvite] = useState([]); // collects friends to invite as group to event


  useEffect(() => {
    getPeopleForEvent()
  }, [])

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  const getPeopleForEvent = async () => {
    const eventPeopleData = await axios.get(`/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`);
    const { eventParticipants, eventInvitees } = eventPeopleData.data;
    // console.log('inside getPeopleForEvent', 'eP', eventParticipants, 'eI', eventInvitees)
    setInvitees(eventInvitees);
    setParticipants(eventParticipants)
  }

  const toggleFriendInvite = (invitee_userId: number) => {
    // if the user is already being invited
    if (friendsToInvite.includes(invitee_userId)) {
      // remove them
      setFriendsToInvite(friendsToInvite.filter((friend) => friend !== invitee_userId))
    } else {
      // or else add them to invite list
      setFriendsToInvite([...friendsToInvite, invitee_userId])
    }
  }

  const sendFriendInvites = async () => {
    try {
      const inviteResponse = await axios.post('/api/events/inviteToEvent', {
        invitations: {
          eventId: selectedEvent.id,
          invitees: friendsToInvite
        }
      })
      // console.log('iR', inviteResponse)
      getPeopleForEvent();
      setFriendsToInvite([]);
    } catch (err) {
      console.error("CLIENT ERROR: failed to POST event invites", err);
    }
  }

  const attendingFriendsItems = friends.filter((friend: any) => participants.includes(friend.id)).map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} {friend.lastName}: attending</li>
  })

  const invitedFriendsItems = friends.filter((friend: any) => invitees.includes(friend.id)).map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} {friend.lastName}: invited</li>
  })

  const uninvitedFriendsItems = friends.filter((friend: any) => !participants.includes(friend.id) && !invitees.includes(friend.id)).map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} {friend.lastName}: not invited
      {isUserAttending && <Form.Check
        type="checkbox"
        id="invite-checkbox"
        label="Check to queue invite"
        onChange={() => toggleFriendInvite(friend.id)}
      />}
    </li>
  })

  // console.log('inside event modal accordion. i:', invitees, 'p', participants, 'f2I', friendsToInvite);
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Who's Going?</Accordion.Header>
        <Accordion.Body>
          <ul>
            {attendingFriendsItems}
          </ul>
          <ul>
            {invitedFriendsItems}
          </ul>
          <ul>
            {uninvitedFriendsItems}
          </ul>
          {isUserAttending && <Button disabled={friendsToInvite.length === 0} onClick={() => sendFriendInvites()}>Send Invites</Button>}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

const EventBasicModal: React.FC<EventBasicModalProps> = ({ selectedEvent, setShowBasicModal, showBasicModal, setSelectedEvent, friends, userId, isUserAttending, setIsUserAttending, getEventsInvited, getEventsParticipating }) => {

  const handleClose = () => {
    setShowBasicModal(false); // goes up to user page and sets to false
    setIsUserAttending(false);
    setSelectedEvent({ latitude: 0, longitude: 0, startTime: null, endTime: null }); // set coordinates so map in modal doesn't throw error for invalid LngLat object
  }

  const toggleAttendance = async () => {
    console.log('inside toggle attendance _____________________________', selectedEvent.id);
    const eventUpdateCount = await axios.post('/api/events/setEventAttendance', {
      answer : {
        eventId: selectedEvent.id,
        userId,
        isAttending: !isUserAttending
      }
    })

    console.log('eventCount', eventUpdateCount.data);
    getEventsInvited();
    getEventsParticipating();
    setIsUserAttending(!isUserAttending);
  }

  // console.log('inside EventBasicModal. isUserAttending', isUserAttending, 'selectedEvent', selectedEvent)
  return (
    <Modal show={showBasicModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>{selectedEvent.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
          <div>
            <EventBasicMapComponent latitude={selectedEvent.latitude} longitude={selectedEvent.longitude} />
          </div>
          <div>
            <p>{selectedEvent.description}</p>
            <p><b>When:</b> {selectedEvent.startTime} to {selectedEvent.endTime} </p>
            {selectedEvent.address && <p><b>Where:</b> {selectedEvent.address}</p>}

            <Form.Switch
              type="switch"
              id="attending-switch"
              label="Attending?"
              onChange={() => toggleAttendance()}
              defaultChecked={isUserAttending}
            />

            { // only allow invites if the user is attending the event
            <EventBasicAccordion
              isUserAttending={isUserAttending}
              selectedEvent={selectedEvent}
              friends={friends}
              userId={userId}
            />}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close Event
        </Button>
      </Modal.Footer>
    </Modal>
  )

};

export default EventBasicModal;