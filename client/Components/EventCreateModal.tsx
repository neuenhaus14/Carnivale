import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Tabs, Tab } from 'react-bootstrap';
import EventCreateMapComponent from './EventCreateMapComponent';
import axios from 'axios';
import dayjs = require('dayjs');
import { ThemeContext } from './Context';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmActionModal from './ConfirmActionModal';

interface EventCreateModalProps {
  selectedEvent: any;
  setSelectedEvent: any;
  setShowCreateModal: any;
  showCreateModal: boolean;
  friends: any;
  userId: number;
  isNewEvent: boolean;
  setIsNewEvent: any;
  lng: number;
  lat: number;
  eventType: string;
  getEventsOwned: any; // needed for reloading owned events after event update
}

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
  const theme = useContext(ThemeContext);
  const [eventAddress, setEventAddress] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventName, setEventName] = useState('');

  const [eventLatitude, setEventLatitude] = useState(0);
  const [eventLongitude, setEventLongitude] = useState(0);

  const now = dayjs();
  // Event time data: will combine to make Date string
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState(2); // 0-24 in 15 min increments
  const [eventEndTime, setEventEndTime] = useState(6); // same

  const [userLatitude, setUserLatitude] = useState(lat); // lat is user location from getLocation
  const [userLongitude, setUserLongitude] = useState(lng); // lng is user location from getLocation

  // INVITATION STATE
  const [friendsToInvite, setFriendsToInvite] = useState([]);
  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);

  // state that monitors if an event in update mode
  // has actually updated, such that the Update Event
  // button will be activated or deactivated
  const [isEventUpdated, setIsEventUpdated] = useState(false);

  const nolaLong = -90.06285;
  const nolaLat = 29.95742;

  // CONFIRM ACTION MODAL STATE
  const [showConfirmActionModal, setShowConfirmActionModal] = useState(false);
  const [confirmActionFunction, setConfirmActionFunction] = useState(null);
  const [confirmActionText, setConfirmActionText] = useState('');

  // geo use effect
  useEffect(() => {
    setUserLatitude(lat);
    setUserLongitude(lng);
  }, [lng, lat]);

  // this uE populates state with
  // values from old events and sets
  // state for parades (start time, location)
  useEffect(() => {
    // user event edit mode: old user event with ownerId of current user
    if (
      isNewEvent === false &&
      eventType === 'user' &&
      selectedEvent.ownerId === userId
    ) {
      setEventName(selectedEvent.name);
      setEventAddress(selectedEvent.address);
      setEventDescription(selectedEvent.description);
      setEventLatitude(Number(selectedEvent.latitude));
      setEventLongitude(Number(selectedEvent.longitude));
      if (selectedEvent.startTime !== null && selectedEvent !== null) {
        parseDateIntoDateAndTime(selectedEvent.startTime, 'start', false);
      }
      if (selectedEvent.endTime !== null && selectedEvent !== null) {
        parseDateIntoDateAndTime(selectedEvent.endTime, 'end', false);
      }
    }
    // user event create mode
    else if (isNewEvent === true && eventType === 'user') {
      setEventName('');
      setEventDescription('');
      setEventAddress('');

      const oneHourLaterTime = Number(now.add(1, 'hour').format('HH'));
      const oneHourLaterDate = now.add(1, 'hour').format('YYYY-MM-DD');
      const twoHoursLaterTime = Number(now.add(2, 'hour').format('HH'));
      const twoHoursLaterDate = now.add(2, 'hour').format('YYYY-MM-DD');

      handleUserCoordinatesToAddress();
      setEventStartTime(oneHourLaterTime);
      setEventStartDate(oneHourLaterDate);
      setEventEndTime(twoHoursLaterTime);
      setEventEndDate(twoHoursLaterDate);
      setEventLatitude(lat ? lat : nolaLat);
      setEventLongitude(lng ? lng : nolaLong);
    }
    // parade event create mode
    else if (isNewEvent === true && eventType === 'parade') {
      setEventName(selectedEvent.title);
      if (selectedEvent.location) {
        setEventAddress(selectedEvent.location);
        setCoordinatesFromAddress(selectedEvent.location);
        parseDateIntoDateAndTime(selectedEvent.startDate, 'start', true);
      }
    }
    //gig event create mode
    else if (isNewEvent === true && eventType === 'gig') {
      setEventName(`${selectedEvent.name} gig`);
      setEventDescription('Live music');
      setEventAddress(selectedEvent.address);
      if (selectedEvent.address) {
        setCoordinatesFromAddress(selectedEvent.address);
      }
      if (selectedEvent.startTime) {
        parseDateIntoDateAndTime(selectedEvent.startTime, 'start', true);
      }
    }
  }, [selectedEvent, isNewEvent]);

  // takes either selectedEvent.startTime or .endTime
  // to populate date input and time ranges
  const parseDateIntoDateAndTime = (
    fullDate: string,
    startOrEnd: string,
    addEndTime: boolean
  ) => {
    let date;
    let time;

    fullDate = fullDate.slice(0, 16);

    if (fullDate.indexOf('T') !== -1) {
      [date, time] = fullDate.split('T');
    } else if (fullDate.indexOf(' ')) {
      [date, time] = fullDate.split(' ');
    }
    const hour = time.slice(0, 2);
    let minute = time.slice(3, time.length);

    switch (minute) {
      case '15':
        minute = '25';
        break;
      case '30':
        minute = '5';
        break;
      case '45':
        minute = '75';
        break;
    }

    const timeRangeValue = Number(`${hour}.${minute}`);

    if (startOrEnd === 'start') {
      setEventStartDate(date);
      setEventStartTime(timeRangeValue);
      if (addEndTime === true) {
        const startTime = dayjs(fullDate);
        const endTime = startTime
          .add(2, 'hour')
          .format('YYYY-MM-DDTHH:mm')
          .toString();
        parseDateIntoDateAndTime(endTime, 'end', false);
      }
    } else if (startOrEnd === 'end') {
      setEventEndDate(date);
      setEventEndTime(timeRangeValue);
    }
  };

  const handleClose = async () => {
    await setShowCreateModal(false); // goes up to user page and sets to false
    // default values for setSelectedEvent
    await setSelectedEvent({
      latitude: 0,
      longitude: 0,
      startTime: null,
      endTime: null,
    });
    await setInvitees([]);
    await setParticipants([]);
    await setFriendsToInvite([]);
    await setIsNewEvent(false); // returns to default state
    await setIsEventUpdated(false); // also default state
    await getEventsOwned(); // retrieves updated or newly created events
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
      if (hour.length===1){
        hour = `0${hour}`
      }
      return `${hour}:${minute}`;
    }

    if (twelveHourClock) {
      if (hour === '24') {
        return 'Midnight';
      } else if (hour === '12' && minute === '00') {
        return 'Noon';
      } else if (Number(hour) >= 12) {
        if (Number(hour) === 12){
          return `${hour.toString()}:${minute} pm`;
        }
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
      toast('🎭 Plans made! 🎭', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (err) {
      console.error('CLIENT ERROR: failed to POST new event', err);
    } finally {
      handleClose(); // close the modal after creating event
    }
  };

  const sendFriendInvites = () => {
    try {
      const inviteResponse = axios.post('/api/events/inviteToEvent', {
        invitations: {
          eventId: selectedEvent.id,
          invitees: friendsToInvite,
          senderId: userId,
        },
      });
      setFriendsToInvite([]);
      getPeopleForEvent(false); // sendFriendInvites only used with old events
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
        },
      });
      setIsEventUpdated(false); // return to default state
      toast('🎭 Plans changed! 🎭', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (err) {
      console.error('CLIENT ERROR: failed to PUT event update', err);
    } finally {
      handleClose();
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const deleteResponse = await axios.delete(
        `/api/events/deleteEvent/${selectedEvent.id}`
      );
      handleClose();
    } catch (err) {
      console.error('CLIENT ERROR: failed to DELETE event record', err);
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

  // handles setting coordinates when address is changed and onBlurred
  const setCoordinatesFromAddress = async (address: any) => {
    try {
      const coordinatesResponse = await axios.post(
        '/api/events/getCoordinatesFromAddress',
        { address }
      );

      const [evtLongitude, evtLatitude] = coordinatesResponse.data;
      setEventLongitude(evtLongitude);
      setEventLatitude(evtLatitude);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET coords from address', err);
    }
  };

  const handleAddressToCoordinates = (e: any) => {
    const { value } = e.target;
    setCoordinatesFromAddress(value);
  };

  const handleUserCoordinatesToAddress = async () => {
    try {
      const eventAddressResponse = await axios.post(
        '/api/events/getAddressFromCoordinates',
        {
          coordinates: {
            latitude: lat,
            longitude: lng,
          },
        }
      );
      const eventAddress = eventAddressResponse.data;
      setEventAddress(eventAddress);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET address from coordinates');
    }
  };

  const getPeopleForEvent = async (isNewEvent: boolean) => {
    try {
      // if the event is new, empty out any
      // invitees or participants who were added
      // in previous clicks
      if (isNewEvent === true) {
        await setInvitees([]);
        await setParticipants([]);
      } else if (isNewEvent === false) {
        const eventPeopleData = await axios.get(
          `/api/events/getPeopleForEvent/${userId}-${selectedEvent.id}`
        );
        const { eventParticipants, eventInvitees } = eventPeopleData.data;
        setInvitees(eventInvitees);
        setParticipants(eventParticipants);
      }
    } catch (err) {
      console.error(
        'CLIENT ERROR: failed to GET people for event',
        err,
        'eT',
        eventType
      );
    }
  };

  //  GETTING PEOPLE FOR THE MODAL
  //  depends on what's inside the selected event
  useEffect(() => {
    if (selectedEvent.ownerId === userId) {
      // old event
      getPeopleForEvent(false);
    } else if (!selectedEvent.ownerId && isNewEvent === true) {
      // new event
      getPeopleForEvent(true);
    }
  }, [selectedEvent]);

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
          {friend.firstName} {friend.lastName}{' '}
          <Form.Check
            style={{ float: 'right', paddingRight: '20px' }}
            label='Add invite'
            type='checkbox'
            // id='invite-checkbox'
            onChange={async () => {
              await toggleFriendInvite(friend.id);
            }}
            checked={friendsToInvite.includes(friend.id)}
          ></Form.Check>
        </div>
      );
    });

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <ConfirmActionModal
        confirmActionFunction={confirmActionFunction}
        setConfirmActionFunction={setConfirmActionFunction}
        confirmActionText={confirmActionText}
        setConfirmActionText={setConfirmActionText}
        showConfirmActionModal={showConfirmActionModal}
        setShowConfirmActionModal={setShowConfirmActionModal}
      />
      <Modal
        className={`event-modal ${theme}`}
        show={showCreateModal}
        onHide={handleClose}
      >
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
            <Tabs defaultActiveKey='details'>
              <Tab eventKey='details' title='Details'>
                <div className='my-2 px-2'>
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
                    eventType={eventType}
                    selectedEvent={selectedEvent}
                    userId={userId}
                  />
                </div>
                <div>
                  <Form>
                    <Form.Group controlId='formEvent'>
                      {/* <p>{eventName}</p> */}

                      <Form.Control
                        type='text'
                        name='name'
                        value={eventName}
                        onChange={handleInputChange}
                        placeholder='Event Name'
                      />

                      {/* <p>{eventDescription}</p> */}

                      <Form.Control
                        type='text'
                        name='description'
                        value={eventDescription}
                        onChange={handleInputChange}
                        placeholder='Description'
                      />

                      {/* <p>{eventAddress}</p> */}

                      <Form.Control
                        type='text'
                        name='address'
                        value={eventAddress}
                        onChange={handleInputChange}
                        onBlur={handleAddressToCoordinates}
                        placeholder='Address'
                      />

                      {/* <p>{eventStartDate}</p> */}
                      <Form.Control
                        type='text'
                        name='start'
                        value={eventStartDate}
                        onChange={handleDateChange}
                        placeholder='Start Date: YYYY-MM-DD'
                      />

                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '100px' }}>
                          <div>
                            {convertDecimalToTime(eventStartTime, true)}
                          </div>
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
                      <Form.Control
                        type='text'
                        name='end'
                        value={eventEndDate}
                        onChange={handleDateChange}
                        placeholder='End Date: YYYY-MM-DD'
                      />

                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '100px' }}>
                          <div>{convertDecimalToTime(eventEndTime, true)}</div>
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
                </div>
              </Tab>

              <Tab eventKey='people' title='People'>
                {friends.length === 0 && (
                  <div>
                    <div className='ep-card-content text-center mt-3'>
                      You're flying solo!
                    </div>
                    <div className='ep-card-detail text-center'>
                      Add to your Krewe to send invitations.
                    </div>
                  </div>
                )}

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

                {isNewEvent === false && uninvitedFriendsItems.length > 0 && (
                  <Button
                    onClick={() => sendFriendInvites()}
                    disabled={friendsToInvite.length === 0}
                  >
                    Send Invites
                  </Button>
                )}
              </Tab>
            </Tabs>
          </div>
        </Modal.Body>
        <Modal.Footer className='d-flex flex-row justify-content-between'>
          {/* left side of footer */}
          <div>
            {!isNewEvent && (
              <Button
                variant='danger'
                onClick={async () => {
                  await setConfirmActionFunction(() => () => {
                    handleDeleteEvent();
                  });
                  await setConfirmActionText(`delete ${selectedEvent.name}`);
                  await setShowConfirmActionModal(true);
                }}
              >
                Delete
              </Button>
            )}
          </div>
          {/* right side of footer */}
          <div>
            {isNewEvent && (
              <Button
                onClick={handleEventCreation}
                className='mx-2'
                disabled={
                  eventName.length === 0 || eventDescription.length === 0
                }
              >
                Create Event
              </Button>
            )}

            {!isNewEvent && (
              <Button
                className='mx-2'
                onClick={handleEventUpdate}
                disabled={isEventUpdated === false}
              >
                Update
              </Button>
            )}

            <Button variant='danger' onClick={handleClose}>
              Close
            </Button>
          </div>

          {/* {!isNewEvent && (
          <>


          </>
        )} */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EventCreateModal;
