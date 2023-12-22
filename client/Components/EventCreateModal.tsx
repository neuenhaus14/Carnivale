import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion, FloatingLabel } from 'react-bootstrap';
import EventCreateMapComponent from './EventCreateMapComponent';
import axios from 'axios';
import Events from '../../server/routes/Events';
import dayjs = require('dayjs');
// import { timeLog } from 'console';
// import { send } from 'process';
// import { getDropdownMenuPlacement } from 'react-bootstrap/esm/DropdownMenu';

interface EventCreateModalProps {
  selectedEvent: any;
  setSelectedEvent: any;
  setShowCreateModal: any;
  showCreateModal: boolean;
  friends: any;
  userId: number;
  //isUserAttending: boolean,
  //setIsUserAttending: any,
  // getEventsInvited: any,
  // getEventsParticipating: any,
  isNewEvent: boolean;
  setIsNewEvent: any;
  lng: number;
  lat: number;
  //getLocation: any,
  eventType: string;
  getEventsOwned: any; // needed for reloading owned events after event update
}

interface EventCreateAccordionProps {
  friends: any;
  selectedEvent: any;
  userId: number;
  isNewEvent: boolean;
  setFriendsToInvite: any;
  friendsToInvite: Array<any>;
  sendFriendInvites: any;
  getPeopleForEvent: any;
  invitees: any;
  participants: any;
  setIsEventUpdated: any;
}

const EventCreateAccordion: React.FC<EventCreateAccordionProps> = ({
  friends,
  selectedEvent,
  userId,
  isNewEvent,
  setFriendsToInvite,
  friendsToInvite,
  sendFriendInvites,
  getPeopleForEvent,
  invitees,
  participants,
  setIsEventUpdated
}) => {
  //const [invitees, setInvitees] = useState([]);
  //const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (isNewEvent === false) {
      console.log('before getPeopleForEvent in accordion');
      getPeopleForEvent();
    }
  }, []);

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  // const getPeopleForEvent = async () => {
  //   const eventPeopleData = await axios.get(
  //     `/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`
  //   );
  //   const { eventParticipants, eventInvitees } = eventPeopleData.data;
  //   setInvitees(eventInvitees);
  //   setParticipants(eventParticipants);
  // };

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

  // const toggleEventIsUpdated = async () => {
  //   if (friendsToInvite.length > 0) {
  //     setIsEventUpdated(true);
  //   } else {
  //     setIsEventUpdated(false);
  //   }
  // }
  // const sendFriendInvites = () => {
  //   try {
  //     const inviteResponse = axios.post('/api/events/inviteToEvent', {
  //       invitations: {
  //         eventId: selectedEvent.id,
  //         invitees: friendsToInvite,
  //       },
  //     });
  //     getPeopleForEvent();
  //   } catch (err) {
  //     console.error('CLIENT ERROR: failed to POST event invites', err);
  //   }
  // };

  const attendingFriendsItems = friends
    .filter((friend: any) => participants.includes(friend.id))
    .map((friend: any, index: number) => {
      return (
        <p key={index}>
          {friend.firstName} {friend.lastName} is attending!
        </p>
      );
    });

  const invitedFriendsItems = friends
    .filter((friend: any) => invitees.includes(friend.id))
    .map((friend: any, index: number) => {
      return (
        <p key={index}>
          {friend.firstName} {friend.lastName} is already invited!
        </p>
      );
    });

  const uninvitedFriendsItems = friends
    .filter(
      (friend: any) =>
        !participants.includes(friend.id) && !invitees.includes(friend.id)
    )
    .map((friend: any, index: number) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'right',
          }}
          key={index}
        >
          <p className='mx-3'>
            {friend.firstName} {friend.lastName}{' '}
          </p>
          <Form.Check
            type='checkbox'
            id='custom-switch'
            onChange={async () => { await toggleFriendInvite(friend.id); }}
          />
        </div>
      );
    });

  return (
    <Accordion>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>Who's Going?</Accordion.Header>
        <Accordion.Body>
          <div>{attendingFriendsItems}</div>
          <div>{invitedFriendsItems}</div>
          <div>{uninvitedFriendsItems}</div>
          {isNewEvent === false && friendsToInvite.length > 0 && (
            <Button onClick={() => sendFriendInvites()}>Send Invites</Button>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

const EventCreateModal: React.FC<EventCreateModalProps> = ({
  selectedEvent,
  setShowCreateModal,
  showCreateModal,
  setSelectedEvent,
  friends,
  userId,
  isNewEvent,
  setIsNewEvent,
  lng,
  lat,
  eventType,
  getEventsOwned,
}) => {
  const [eventAddress, setEventAddress] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventName, setEventName] = useState('');

  const [eventLatitude, setEventLatitude] = useState(0);
  const [eventLongitude, setEventLongitude] = useState(0);

  // Event time data: will combine to make Date string
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState(2); // 0-24 in 15 min increments
  const [eventEndTime, setEventEndTime] = useState(6); // same

  const [userLatitude, setUserLatitude] = useState(lat); // lat is user location from getLocation
  const [userLongitude, setUserLongitude] = useState(lng); // lng is user location from getLocation

  // all three get passed to accordion
  const [friendsToInvite, setFriendsToInvite] = useState([]);

  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);

  // state that monitors if an event in update mode
  // has actually updated, such that the Update Event
  // button will be activated or deactivated
  const [isEventUpdated, setIsEventUpdated] = useState(false);

  // geo use effect
  useEffect(() => {
    setUserLatitude(lat);
    setUserLongitude(lng);
  }, [lng, lat]);

  // new/old event modal
  useEffect(() => {
    // user event edit mode
    if (isNewEvent === false) {
      console.log('inNewEvent', isNewEvent);
      setEventName(selectedEvent.name);
      setEventAddress(selectedEvent.address);
      setEventDescription(selectedEvent.description);
      setEventLatitude(Number(selectedEvent.latitude));
      setEventLongitude(Number(selectedEvent.longitude));
      if (selectedEvent.startTime !== null && selectedEvent !== null) {
        console.log('incoming selectedEvent startTime', selectedEvent.startTime);
        parseDateIntoDateAndTime(selectedEvent.startTime, 'start');
      }
      if (selectedEvent.endTime !== null && selectedEvent !== null) {
        console.log('incoming selectedEvent endTime', selectedEvent.endTime);
        parseDateIntoDateAndTime(selectedEvent.endTime, 'end');
      }
    }
    // user event create mode
    else if (isNewEvent === true && eventType === 'user') {
      console.log('eventType', eventType, 'selectedEvent', selectedEvent);
      setEventName('');
      setEventAddress('');
      setEventDescription('');
      setEventStartTime(12);
      setEventEndTime(14);
    }

    // parade event create mode
    else if (isNewEvent === true && eventType === 'parade') {
      setEventName(selectedEvent.title);
      setEventAddress(selectedEvent.location);
      setCoordinatesFromAddress(selectedEvent.location);
    }
  }, [selectedEvent, isNewEvent]);

  // takes either selectedEvent.startTime or .endTime
  // to populate date input and time ranges
  const parseDateIntoDateAndTime = (fullDate: string, startOrEnd: string) => {
    // 2023-12-11 20:40:35.222-05
    console.log('parseDID&T', fullDate, startOrEnd);
    let date;
    let time;
    if (fullDate.indexOf('T')) {
      [date, time] = fullDate.split('T');
    } else if (fullDate.indexOf(' ')) {
      [date, time] = fullDate.split(' ');
    }

    const timeRangeValue = Number(time.slice(0, 5).replace(':', '.'));
    console.log('tRV', timeRangeValue);
    if (startOrEnd === 'start') {
      setEventStartDate(date);
      setEventStartTime(timeRangeValue);
    } else if (startOrEnd === 'end') {
      setEventEndDate(date);
      setEventEndTime(timeRangeValue);
    }
  };

  const handleClose = () => {
    setShowCreateModal(false); // goes up to user page and sets to false
    // set coordinates so map in modal doesn't throw error for invalid LngLat object
    setSelectedEvent({
      latitude: 0,
      longitude: 0,
      startTime: null,
      endTime: null,
    });
    setIsNewEvent(false); // returns to default state
    setIsEventUpdated(false); // also default state
    getEventsOwned(); // retrieves updated or newly created events
  };

  const convertDecimalToTime = (
    time: number,
    twelveHourClock: boolean = false
  ) => {
    let hour: any;
    let minute: any;
    const timeString: string = time.toString();
    if (timeString.indexOf('.') === -1) {
      hour = timeString;
      minute = '00';
    } else {
      [hour, minute] = timeString.split('.');

      switch (minute) {
        case '25':
          minute = '15';
          break;
        case '5':
          minute = '30';
          break;
        case '75':
          minute = '45';
          break;
      }
    }

    if (!twelveHourClock) {
      return `${hour}:${minute}`;
    }

    if (twelveHourClock) {
      if (hour === '24') {
        return 'Midnight';
      } else if (hour === '12' && minute === '00') {
        return 'Noon';
      } else if (Number(hour) > 12) {
        hour = Number(hour) - 12;
        return `${hour.toString()}:${minute} pm`;
      } else {
        return `${hour}:${minute} am`;
      }
    }
  };

  const stringifyDateTime = (date: string, timeDecimal: number) => {
    const formattedTime = convertDecimalToTime(timeDecimal);
    return `${date}T${formattedTime}`;
  };

  const handleEventCreation = async () => {
    try {
      const startTimeString = stringifyDateTime(eventStartDate, eventStartTime);
      const endTimeString = stringifyDateTime(eventEndDate, eventEndTime);
      // console.log('sts,ets', startTimeString, endTimeString)
      const newEvent = await axios.post('/api/events/createEvent', {
        event: {
          ownerId: userId,
          name: eventName,
          address: eventAddress,
          description: eventDescription,
          latitude: eventLatitude,
          longitude: eventLongitude,
          system: false,
          link: null,
          invitedCount: friendsToInvite.length,
          attendingCount: 1,
          startTime: startTimeString,
          endTime: endTimeString,
          invitees: friendsToInvite,
        },
      });
      // console.log(newEvent.data)
      handleClose(); // close the modal after creating event
    } catch (err) {
      console.error('CLIENT ERROR: failed to POST new event', err);
    }
  };

  // ONLY A USER'S FRIENDS WILL POPULATE THESE AREA
  const getPeopleForEvent = async () => {
    const eventPeopleData = await axios.get(
      `/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`
    );
    const { eventParticipants, eventInvitees } = eventPeopleData.data;
    setInvitees(eventInvitees);
    setParticipants(eventParticipants);
  };

  const sendFriendInvites = () => {
    try {
      const inviteResponse = axios.post('/api/events/inviteToEvent', {
        invitations: {
          eventId: selectedEvent.id,
          invitees: friendsToInvite,
        },
      });
      getPeopleForEvent();
    } catch (err) {
      console.error('CLIENT ERROR: failed to POST event invites', err);
    }
  };

  const handleEventUpdate = async () => {
    try {
      const startTimeString = stringifyDateTime(eventStartDate, eventStartTime);
      const endTimeString = stringifyDateTime(eventEndDate, eventEndTime);

      const updatedEvent = await axios.patch('/api/events/updateEvent', {
        event: {
          id: selectedEvent.id,
          name: eventName,
          address: eventAddress,
          description: eventDescription,
          latitude: eventLatitude,
          longitude: eventLongitude,
          startTime: startTimeString,
          endTime: endTimeString,
          //system: false,
          //link: null,
          //invitedCount: friendsToInvite.length,
          //attendingCount: 1,
          //invitees: friendsToInvite,
        },
      });
      setIsEventUpdated(false); // return to default state
      // console.log('updatedEvent response', updatedEvent.data);
      // if (friendsToInvite.length > 0) {
      //   sendFriendInvites();
      // }
      handleClose();
    } catch (err) {
      console.error('CLIENT ERROR: failed to PUT event update', err);
    }
  };

  const handleRangeChange = (e: any) => {
    const { value, name } = e.target;

    if (name === 'start') {
      setEventStartTime(value);
    } else if (name === 'end') {
      setEventEndTime(value);
    }

    // enable Update button in update mode
    setIsEventUpdated(true);
  };

  const handleDateChange = (e: any) => {
    const { value, name } = e.target;

    if (name === 'start') {
      setEventStartDate(value);
    } else if (name === 'end') {
      setEventEndDate(value);
    }
    // enable Update button in update mode
    setIsEventUpdated(true);
  };

  const handleInputChange = (e: any) => {
    const { value, name } = e.target;

    if (name === 'name') {
      setEventName(value);
    } else if (name === 'description') {
      setEventDescription(value);
    } else if (name === 'address') {
      setEventAddress(value);
    }
    setIsEventUpdated(true); // enables Update Event button
  };

  const setCoordinatesFromAddress = async (address: any) => {
    const coordinatesResponse = await axios.post(
      '/api/events/getCoordinatesFromAddress',
      { address }
    );

    const [evtLongitude, evtLatitude] = coordinatesResponse.data;
    setEventLongitude(evtLongitude);
    setEventLatitude(evtLatitude);
  };

  // handles setting coordinates when address is changed and onBlurred
  const handleAddressToCoordinates = (e: any) => {
    const { value } = e.target;
    setCoordinatesFromAddress(value);
  };

  console.log('rock bottom, isEventUpdated',isEventUpdated,'selectedEvent', selectedEvent, 'isNewEvent', isNewEvent);
  return (
    <Modal show={showCreateModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>
          {isNewEvent === false
            ? eventName
            : eventName
            ? eventName
            : 'Drop a pin for your event'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
          }}
        >
          <div>
            <EventCreateMapComponent
              isNewEvent={isNewEvent}
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              eventLatitude={eventLatitude}
              eventLongitude={eventLongitude}
              setEventLatitude={setEventLatitude}
              setEventLongitude={setEventLongitude}
              setEventAddress={setEventAddress}
              setIsEventUpdated={setIsEventUpdated}
            />
          </div>
          <div>
            <Form>
              <Form.Group className='mb-5' controlId='formEvent'>
                {/* <p>{eventName}</p> */}
                <FloatingLabel
                  controlId='floatingEventNameInput'
                  label='Event Name'
                  className='my-1'
                >
                  <Form.Control
                    type='text'
                    name='name'
                    value={eventName}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>

                {/* <p>{eventDescription}</p> */}
                <FloatingLabel
                  controlId='floatingEventDescriptionInput'
                  label='Description'
                  className='mb-1'
                >
                  <Form.Control
                    type='text'
                    name='description'
                    value={eventDescription}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>

                {/* <p>{eventAddress}</p> */}
                <FloatingLabel
                  controlId='floatingEventAddressInput'
                  label='Address'
                  className='mb-1'
                >
                  <Form.Control
                    type='text'
                    name='address'
                    value={eventAddress}
                    onChange={handleInputChange}
                    onBlur={handleAddressToCoordinates}
                  />
                </FloatingLabel>

                {/* <p>{eventStartDate}</p> */}
                <FloatingLabel
                  controlId='floatingEventStartDateInput'
                  label='Start Date: YYYY-MM-DD'
                  className='mb-1'
                >
                  <Form.Control
                    type='text'
                    name='start'
                    value={eventStartDate}
                    onChange={handleDateChange}
                  />
                </FloatingLabel>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: '85px' }}>
                    <p>{convertDecimalToTime(eventStartTime, true)}</p>
                  </div>
                  <Form.Range
                    min={0}
                    max={24}
                    value={eventStartTime}
                    name='start'
                    step={0.25}
                    onChange={handleRangeChange}
                  />
                </div>

                {/* <p>{eventEndDate}</p> */}
                <FloatingLabel
                  controlId='floatingEventEndDateInput'
                  label='End Date: YYYY-MM-DD'
                  className='mb-1'
                >
                  <Form.Control
                    type='text'
                    name='end'
                    value={eventEndDate}
                    onChange={handleDateChange}
                  />
                </FloatingLabel>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: '85px' }}>
                    <p>{convertDecimalToTime(eventEndTime, true)}</p>
                  </div>
                  <Form.Range
                    min={0}
                    max={24}
                    value={eventEndTime}
                    step={0.25}
                    name='end'
                    onChange={handleRangeChange}
                  />
                </div>
              </Form.Group>
            </Form>

            <EventCreateAccordion
              selectedEvent={selectedEvent}
              friends={friends}
              userId={userId}
              isNewEvent={isNewEvent} // passing this thru to accordion to determine whether to get event's people
              setFriendsToInvite={setFriendsToInvite}
              friendsToInvite={friendsToInvite}
              sendFriendInvites={sendFriendInvites}
              getPeopleForEvent={getPeopleForEvent}
              invitees={invitees}
              participants={participants}
              setIsEventUpdated={setIsEventUpdated}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isNewEvent && (
          <Button onClick={handleEventCreation}>Create Event</Button>
        )}
        {!isNewEvent && (
          <Button
            onClick={handleEventUpdate}
            disabled={isEventUpdated === false}
          >
            Update Event
          </Button>
        )}
        <Button variant='danger' onClick={handleClose}>
          X
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventCreateModal;
