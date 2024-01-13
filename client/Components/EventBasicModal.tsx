import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Tabs, Tab } from 'react-bootstrap';
import EventBasicMapComponent from './EventBasicMapComponent';
import axios from 'axios';
import dayjs = require('dayjs');
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ThemeContext } from './Context';
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);

// This modal displays for events that the user
// is invited to and attending
// you can only invite other people if you're
// already attending

interface EventBasicModalProps {
  selectedEvent: any;
  setSelectedEvent: any;
  setShowBasicModal: any;
  showBasicModal: boolean;
  friends: any;
  userId: number;
  isUserAttending: boolean;
  setIsUserAttending: any;
  getEventsInvited: any;
  getEventsParticipating: any;
}

const EventBasicModal: React.FC<EventBasicModalProps> = ({
  selectedEvent,
  setShowBasicModal,
  showBasicModal,
  setSelectedEvent,
  friends,
  userId,
  isUserAttending,
  setIsUserAttending,
  getEventsInvited,
  getEventsParticipating,
}) => {
  const handleClose = async () => {
    await setInvitees([]);
    await setParticipants([])
    await setShowBasicModal(false); // goes up to user page and sets to false
    await setIsUserAttending(false);
    await setSelectedEvent({
      latitude: 0,
      longitude: 0,
      startTime: null,
      endTime: null,
    }); // set coordinates so map in modal doesn't throw error for invalid LngLat object
  };

  const toggleAttendance = async () => {
    const eventUpdateCount = await axios.post(
      '/api/events/setEventAttendance',
      {
        answer: {
          eventId: selectedEvent.id,
          userId,
          isAttending: !isUserAttending,
        },
      }
    );
    getEventsInvited();
    getEventsParticipating();
    setIsUserAttending(!isUserAttending);
  };

  const theme = useContext(ThemeContext)


  //    PEOPLE ACCORDION FUNCTIONALITY
  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [friendsToInvite, setFriendsToInvite] = useState([]); // collects friends to invite as group to event

  useEffect(() => {
    if (selectedEvent.latitude !== 0 && selectedEvent.ownerId !== userId) {
      getPeopleForEvent();
    }
  }, [selectedEvent]);

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  const getPeopleForEvent = async () => {
    const eventPeopleData = await axios.get(
      `/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`
    );
    const { eventParticipants, eventInvitees } = eventPeopleData.data;
    setInvitees(eventInvitees);
    setParticipants(eventParticipants);
  };

  const toggleFriendInvite = (invitee_userId: number) => {
    // if the user is already being invited
    if (friendsToInvite.includes(invitee_userId)) {
      // remove them
      setFriendsToInvite(
        friendsToInvite.filter((friend) => friend !== invitee_userId)
      );
    } else {
      // or else add them to invite list
      setFriendsToInvite([...friendsToInvite, invitee_userId]);
    }
  };

  const sendFriendInvites = async () => {
    try {
      const inviteResponse = await axios.post('/api/events/inviteToEvent', {
        invitations: {
          eventId: selectedEvent.id,
          invitees: friendsToInvite,
        },
      });
      getPeopleForEvent();
      setFriendsToInvite([]);
    } catch (err) {
      console.error('CLIENT ERROR: failed to POST event invites', err);
    }
  };

  const attendingFriendsItems = friends
    .filter((friend: any) => participants.includes(friend.id))
    .map((friend: any, index: number) => {
      return (
        <div key={index}>
          {friend.firstName} {friend.lastName}
        </div>
      );
    });

  const invitedFriendsItems = friends
    .filter((friend: any) => invitees.includes(friend.id))
    .map((friend: any, index: number) => {
      return (
        <div key={index}>
          {friend.firstName} {friend.lastName}
        </div>
      );
    });

  const uninvitedFriendsItems = friends
    .filter(
      (friend: any) =>
        !participants.includes(friend.id) && !invitees.includes(friend.id)
    )
    .map((friend: any, index: number) => {
      return (
        <div className='d-flex flex-row justify-content-between' key={index}>
          <div>{friend.firstName} {friend.lastName}</div>
          {isUserAttending && (
            <Form.Check
              style={{ float: 'right', paddingRight: '20px' }}
              type='checkbox'
              // id='invite-checkbox'
              label={`Add Invite`}
              onChange={() => toggleFriendInvite(friend.id)}
            />
          )}
        </div>
      );
    });


  return (
    <Modal className={theme} show={showBasicModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>
          {selectedEvent.name} {}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey='details'>
          <Tab eventKey='details' title='Details'>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
              }}
            >
              <div className='my-2 px-2'>
                <EventBasicMapComponent
                  latitude={selectedEvent.latitude}
                  longitude={selectedEvent.longitude}
                />
              </div>

              <div>
                <div>
                    <b>What: </b>
                    {selectedEvent.description}
                </div>

                <div className='d-flex flex-column'>
                  <div>
                    <b>When: </b>
                    {dayjs().to(dayjs(selectedEvent.startTime))}
                  </div>
                  <div>
                    <em>{dayjs(selectedEvent.startTime).format('ddd MMM D, h:mm a')} to {dayjs(selectedEvent.endTime).format('h:mm a')}</em>
                  </div>
                </div>

                {selectedEvent.address && (
                  <div>
                    <b>Where:</b> {selectedEvent.address}
                  </div>
                )}
              </div>
            </div>
          </Tab>

          <Tab eventKey='people' title='People'>
            {attendingFriendsItems.length > 0 && (
              <div>
                <h5>Attending</h5>
                <ul>{attendingFriendsItems}</ul>
              </div>
            )}

            {invitedFriendsItems.length > 0 && (
              <div>
                <h5>Invited</h5>
                <ul>{invitedFriendsItems}</ul>
              </div>
            )}

            {uninvitedFriendsItems.length > 0 && (
              <div>
                <h5>Uninvited</h5>
                <ul>{uninvitedFriendsItems}</ul>
              </div>
            )}

            {isUserAttending && uninvitedFriendsItems.length > 0 && (
              <Button
                disabled={friendsToInvite.length === 0}
                onClick={() => sendFriendInvites()}
              >
                Send Invites
              </Button>
            )}
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Form.Switch
          type='switch'
          id='attending-switch'
          label={isUserAttending ? 'Attending' : 'Not attending'}
          onChange={() => toggleAttendance()}
          defaultChecked={isUserAttending}
          disabled = {dayjs().isAfter(selectedEvent.endTime)}
        />
        <Button variant='danger' onClick={handleClose}>
          Close Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventBasicModal;
