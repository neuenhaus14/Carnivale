import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap'
import EventCreateMapComponent from './EventCreateMapComponent';
import axios from 'axios';
import moment from 'moment';


interface EventCreateModalProps {
  selectedEvent: any,
  setSelectedEvent: any,
  setShowCreateModal: any,
  showCreateModal: boolean,
  friends: any,
  userId: number,
  isUserAttending: boolean,
  setIsUserAttending: any,
  getEventsInvited: any,
  getEventsParticipating: any
}

interface EventCreateAccordionProps {
  friends: any,
  selectedEvent: any,
  userId: number
}




const EventCreateAccordion: React.FC<EventCreateAccordionProps> = ({ friends, selectedEvent, userId }) => {

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

  const sendFriendInvites = () => {
    try {
      const inviteResponse = axios.post('/api/events/inviteToEvent', {
        invitations: {
          eventId: selectedEvent.id,
          invitees: friendsToInvite
        }
      })
      console.log('iR', inviteResponse)
      getPeopleForEvent();
    } catch (err) {
      console.error("CLIENT ERROR: failed to POST event invites", err);
    }
  }

  const attendingFriendsItems = friends.filter((friend: any) => participants.includes(friend.id)).map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} {friend.lastName} is attending!</li>
  })

  const invitedFriendsItems = friends.filter((friend: any) => invitees.includes(friend.id)).map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} {friend.lastName} is already invited!</li>
  })

  const uninvitedFriendsItems = friends.filter((friend: any) => !participants.includes(friend.id) && !invitees.includes(friend.id)).map((friend: any, index: number) => {
    return <li key={index}>{friend.firstName} {friend.lastName} is not invited!
      <Form.Switch
        type="switch"
        id="custom-switch"
        label="Check to invite"
        onChange={() => toggleFriendInvite(friend.id)}
      />
    </li>
  })

  console.log('inside event modal accordion. i:', invitees, 'p', participants, 'f2I', friendsToInvite);
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
          {friendsToInvite.length > 0 && <button onClick={() => sendFriendInvites()}>Send Invites</button>}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

const EventCreateModal: React.FC<EventCreateModalProps> = ({ selectedEvent, setShowCreateModal, showCreateModal, setSelectedEvent, friends, userId, getEventsInvited, getEventsParticipating }) => {
  const handleClose = () => {
    setShowCreateModal(false); // goes up to user page and sets to false
    setSelectedEvent({ latitude: 0, longitude: 0, startTime: null, endTime: null }); // set coordinates so map in modal doesn't throw error for invalid LngLat object
  }

  return (
    <Modal show={showCreateModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedEvent.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{display: 'flex', flexDirection: 'column', alignContent:'center'}}>
          <div>
            <EventCreateMapComponent latitude={selectedEvent.latitude} longitude={selectedEvent.longitude} />
          </div>
          <div>
            <p>{selectedEvent.description}</p>
            <p><b>When:</b> {moment(selectedEvent.startTime).format('MMM Do, h:mm a')} to {moment(selectedEvent.endTime).format('h:mm a')} <em>({moment(selectedEvent.startTime).fromNow()})</em></p>
            {selectedEvent.address && <p><b>Where:</b> {selectedEvent.address}</p>} 
            <EventCreateAccordion
              selectedEvent={selectedEvent}
              friends={friends}
              userId={userId}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          X
        </Button>
      </Modal.Footer>
    </Modal>
  )

};

export default EventCreateModal;