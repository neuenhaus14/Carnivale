import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion, Tabs, Tab } from 'react-bootstrap';
import EventBasicMapComponent from './EventBasicMapComponent';
import axios from 'axios';
import dayjs = require('dayjs');
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

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

interface EventBasicAccordionProps {
  friends: any;
  selectedEvent: any;
  userId: number;
  isUserAttending: boolean;
}

interface EventBasicKreweTabProps {
  friends: any;
  selectedEvent: any;
  userId: number;
  isUserAttending: boolean;
}

// MAYBE ADD A useEffect THAT FETCHES WHO'S ATTENDING
// AN EVENT WHENEVER SELECTED EVENT CHANGES

const EventBasicAccordion: React.FC<EventBasicAccordionProps> = ({
  friends,
  selectedEvent,
  userId,
  isUserAttending,
}) => {
  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [friendsToInvite, setFriendsToInvite] = useState([]); // collects friends to invite as group to event

  useEffect(() => {
    getPeopleForEvent();
  }, []);

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  const getPeopleForEvent = async () => {
    const eventPeopleData = await axios.get(
      `/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`
    );
    const { eventParticipants, eventInvitees } = eventPeopleData.data;
    // console.log('inside getPeopleForEvent', 'eP', eventParticipants, 'eI', eventInvitees)
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
      // console.log('iR', inviteResponse)
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
        <li key={index}>
          {friend.firstName} {friend.lastName}: attending
        </li>
      );
    });

  const invitedFriendsItems = friends
    .filter((friend: any) => invitees.includes(friend.id))
    .map((friend: any, index: number) => {
      return (
        <li key={index}>
          {friend.firstName} {friend.lastName}: invited
        </li>
      );
    });

  const uninvitedFriendsItems = friends
    .filter(
      (friend: any) =>
        !participants.includes(friend.id) && !invitees.includes(friend.id)
    )
    .map((friend: any, index: number) => {
      return (
        <li key={index}>
          {friend.firstName} {friend.lastName}: not invited
          {isUserAttending && (
            <Form.Check
              type='checkbox'
              id='invite-checkbox'
              label='Check to queue invite'
              onChange={() => toggleFriendInvite(friend.id)}
            />
          )}
        </li>
      );
    });

  // console.log('inside event modal accordion. i:', invitees, 'p', participants, 'f2I', friendsToInvite);
  return (
    <Accordion>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>Who's Going?</Accordion.Header>
        <Accordion.Body>
          <ul>{attendingFriendsItems}</ul>
          <ul>{invitedFriendsItems}</ul>
          <ul>{uninvitedFriendsItems}</ul>
          {isUserAttending && (
            <Button
              disabled={friendsToInvite.length === 0}
              onClick={() => sendFriendInvites()}
            >
              Send Invites
            </Button>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

const EventBasicKreweTab: React.FC<EventBasicKreweTabProps> = ({
  friends,
  selectedEvent,
  userId,
  isUserAttending,
}) => {
  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [friendsToInvite, setFriendsToInvite] = useState([]); // collects friends to invite as group to event

  useEffect(() => {
    getPeopleForEvent();
  }, []);

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  const getPeopleForEvent = async () => {
    const eventPeopleData = await axios.get(
      `/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`
    );
    const { eventParticipants, eventInvitees } = eventPeopleData.data;
    // console.log('inside getPeopleForEvent', 'eP', eventParticipants, 'eI', eventInvitees)
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
      // console.log('iR', inviteResponse)
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
        <li key={index}>
          {friend.firstName} {friend.lastName}: attending
        </li>
      );
    });

  const invitedFriendsItems = friends
    .filter((friend: any) => invitees.includes(friend.id))
    .map((friend: any, index: number) => {
      return (
        <li key={index}>
          {friend.firstName} {friend.lastName}: invited
        </li>
      );
    });

  const uninvitedFriendsItems = friends
    .filter(
      (friend: any) =>
        !participants.includes(friend.id) && !invitees.includes(friend.id)
    )
    .map((friend: any, index: number) => {
      return (
        <li key={index}>
          {friend.firstName} {friend.lastName}: not invited
          {isUserAttending && (
            <Form.Check
              type='checkbox'
              id='invite-checkbox'
              label='Check to queue invite'
              onChange={() => toggleFriendInvite(friend.id)}
            />
          )}
        </li>
      );
    });

  return (
    <Tab eventKey='people' title='People'>
      <ul>{attendingFriendsItems}</ul>
      <ul>{invitedFriendsItems}</ul>
      <ul>{uninvitedFriendsItems}</ul>
      {isUserAttending && (
        <Button
          disabled={friendsToInvite.length === 0}
          onClick={() => sendFriendInvites()}
        >
          Send Invites
        </Button>
      )}
    </Tab>
  );
};

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
  const handleClose = () => {
    setShowBasicModal(false); // goes up to user page and sets to false
    setIsUserAttending(false);
    setSelectedEvent({
      latitude: 0,
      longitude: 0,
      startTime: null,
      endTime: null,
    }); // set coordinates so map in modal doesn't throw error for invalid LngLat object
  };

  const parseDateIntoDateAndTime = (fullDate: string, returnType: string) => {
    // 2023-12-11 20:40:35.222-05
    console.log('parseDID&T', fullDate);
    let date;
    let time;
    if (fullDate.indexOf('T')) {
      [date, time] = fullDate.split('T');
    } else if (fullDate.indexOf(' ')) {
      [date, time] = fullDate.split(' ');
    }

    if (returnType === 'date') {
      return date;
    } else if (returnType === 'time') {
      return time;
    }

    // const timeRangeValue = Number(time.slice(0, 5).replace(':', '.'));

    // console.log('tRV', timeRangeValue);
    // if (startOrEnd === 'start') {
    //   setEventStartDate(date);
    //   setEventStartTime(timeRangeValue);
    // } else if (startOrEnd === 'end') {
    //   setEventEndDate(date);
    //   setEventEndTime(timeRangeValue);
    // }
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

    // console.log('eventCount', eventUpdateCount.data);
    getEventsInvited();
    getEventsParticipating();
    setIsUserAttending(!isUserAttending);
  };

  //    PEOPLE ACCORDION FUNCTIONALITY

  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [friendsToInvite, setFriendsToInvite] = useState([]); // collects friends to invite as group to event

  useEffect(() => {
    getPeopleForEvent();
  }, []);

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  const getPeopleForEvent = async () => {
    const eventPeopleData = await axios.get(
      `/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`
    );
    const { eventParticipants, eventInvitees } = eventPeopleData.data;
    // console.log('inside getPeopleForEvent', 'eP', eventParticipants, 'eI', eventInvitees)
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
      // console.log('iR', inviteResponse)
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
        <li key={index}>
          {friend.firstName} {friend.lastName}: attending
        </li>
      );
    });

  const invitedFriendsItems = friends
    .filter((friend: any) => invitees.includes(friend.id))
    .map((friend: any, index: number) => {
      return (
        <li key={index}>
          {friend.firstName} {friend.lastName}: invited
        </li>
      );
    });

  const uninvitedFriendsItems = friends
    .filter(
      (friend: any) =>
        !participants.includes(friend.id) && !invitees.includes(friend.id)
    )
    .map((friend: any, index: number) => {
      return (
        <li key={index}>
          {friend.firstName} {friend.lastName}: not invited
          {isUserAttending && (
            <Form.Check
              type='checkbox'
              id='invite-checkbox'
              label='Check to queue invite'
              onChange={() => toggleFriendInvite(friend.id)}
            />
          )}
        </li>
      );
    });

  ////////////////////////////////////////

  return (
    <Modal className='event-modal' show={showBasicModal} onHide={handleClose}>
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
              <div>
                <EventBasicMapComponent
                  latitude={selectedEvent.latitude}
                  longitude={selectedEvent.longitude}
                />
              </div>
              <div>
                <p>
                  <b>What: </b>
                  {selectedEvent.description}
                </p>
                <p>
                  <b>When: </b>
                  <em>{dayjs().to(dayjs(selectedEvent.startTime))}</em>{' '}
                  {selectedEvent.startTime} to {selectedEvent.endTime}{' '}
                </p>
                {selectedEvent.address && (
                  <p>
                    <b>Where:</b> {selectedEvent.address}
                  </p>
                )}
              </div>
            </div>
          </Tab>

          <Tab eventKey='people' title='People'>
            <ul>{attendingFriendsItems}</ul>
            <ul>{invitedFriendsItems}</ul>
            <ul>{uninvitedFriendsItems}</ul>
            {isUserAttending && (
              <Button
                disabled={friendsToInvite.length === 0}
                onClick={() => sendFriendInvites()}
              >
                Send Invites
              </Button>
            )}
          </Tab>

          {/* <EventBasicKreweTab
                isUserAttending={isUserAttending}
                selectedEvent={selectedEvent}
                friends={friends}
                userId={userId}/> */}

          <Tab eventKey='people1' title='People1'>
            {/* <Form.Switch
              type='switch'
              id='attending-switch'
              label='Attending?'
              onChange={() => toggleAttendance()}
              defaultChecked={isUserAttending}
            /> */}

            {
              // only allow invites if the user is attending the event
              <EventBasicAccordion
                isUserAttending={isUserAttending}
                selectedEvent={selectedEvent}
                friends={friends}
                userId={userId}
              />
            }
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'around' }}>
        <Form.Switch
          type='switch'
          id='attending-switch'
          label='Attending?'
          onChange={() => toggleAttendance()}
          defaultChecked={isUserAttending}
        />
        <Button variant='danger' onClick={handleClose}>
          Close Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventBasicModal;
