import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion, FloatingLabel } from 'react-bootstrap'
import EventCreateMapComponent from './EventCreateMapComponent';
import axios from 'axios';
import Events from '../../server/routes/Events';


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
  getEventsParticipating: any,
  isNewEvent: boolean,
  setIsNewEvent: any,
  getLocation: any,
  lng: number,
  lat: number,
}

interface EventCreateAccordionProps {
  friends: any,
  selectedEvent: any,
  userId: number
  isNewEvent: boolean,
  setFriendsToInvite: any,
  friendsToInvite: Array<any>,
}


const EventCreateAccordion: React.FC<EventCreateAccordionProps> = ({ friends, selectedEvent, userId, isNewEvent, setFriendsToInvite, friendsToInvite }) => {

  const [invitees, setInvitees] = useState([]);
  const [participants, setParticipants] = useState([]);
  // const [friendsToInvite, setFriendsToInvite] = useState([]); // collects friends to invite as group to event


  useEffect(() => {
    if (isNewEvent === false) {
      console.log('before getPeopleForEvent in accordion')
      getPeopleForEvent()
    }
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
        label="Check too invite"
        onChange={() => toggleFriendInvite(friend.id)}
      />
    </li>
  })

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
          {isNewEvent === false && friendsToInvite.length > 0 && <button onClick={() => sendFriendInvites()}>Send Invites</button>}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

const EventCreateModal: React.FC<EventCreateModalProps> = ({
  selectedEvent, setShowCreateModal, showCreateModal,
  setSelectedEvent, friends, userId, getEventsInvited,
  getEventsParticipating, isNewEvent, getLocation, lng, lat }) => {

  const [eventAddress, setEventAddress] = useState('');
  const [eventDescription, setEventDescription] = useState('')
  const [eventName, setEventName] = useState('')

  const [eventLatitude, setEventLatitude] = useState(0);
  const [eventLongitude, setEventLongitude] = useState(0);

  // Event time data: will combine to make Date string
  const [eventStartDate, setEventStartDate] = useState('')
  const [eventEndDate, setEventEndDate] = useState('')
  const [eventStartTime, setEventStartTime] = useState(2); // 0-24 in 15 min increments
  const [eventEndTime, setEventEndTime] = useState(6);     // same

  const [userLatitude, setUserLatitude] = useState(lat); // lat is user location from getLocation
  const [userLongitude, setUserLongitude] = useState(lng); // lng is user location from getLocation
  
  // both get passed to accordion
  const [friendsToInvite, setFriendsToInvite] = useState([]);

  // geo use effect
  useEffect(() => {
    setUserLatitude(lat);
    setUserLongitude(lng);
  }, [lng, lat])

  // new/old event modal
  useEffect(() => {
    //console.log('inside Modal. isNewEvent', isNewEvent, 'selectedEvent', selectedEvent)

    // event edit mode
    if (isNewEvent === false) {
      setEventName(selectedEvent.name)
      setEventAddress(selectedEvent.address);
      setEventDescription(selectedEvent.description);
      setEventLatitude(Number(selectedEvent.latitude));
      setEventLongitude(Number(selectedEvent.longitude));
      if (selectedEvent.startTime !== null && selectedEvent !== null){
        parseDateIntoDateAndTime(selectedEvent.startTime, 'start');
        parseDateIntoDateAndTime(selectedEvent.endTime, 'end');
      }
    }
    // event create mode
    else if (isNewEvent === true) {
      setEventName('');
      setEventAddress('');
      setEventDescription('');
      setEventStartTime(12);
      setEventEndTime(14);
    }
  }, [selectedEvent, isNewEvent])


  // takes either selectedEvent.startTime or .endTime
  // to populate date input and time ranges
  const parseDateIntoDateAndTime = (fullDate: string, startOrEnd: string) => {
    // 2023-12-11 20:40:35.222-05
    const [date, time] = fullDate.split('T');

    const timeRangeValue = Number(time.slice(0,5).replace(':', '.'))

    if (startOrEnd === 'start'){
      // console.log(date, time, timeRangeValue, startOrEnd);
      setEventStartDate(date);
      setEventStartTime(timeRangeValue);
    } else if (startOrEnd === 'end'){
      setEventEndDate(date);
      setEventEndTime(timeRangeValue);
    }
  }

  const handleClose = () => {
    setShowCreateModal(false); // goes up to user page and sets to false
    setSelectedEvent({ latitude: 0, longitude: 0, startTime: null, endTime: null }); // set coordinates so map in modal doesn't throw error for invalid LngLat object
  }

  const handleEventCreation = async () => {
    try {

      console.log('hEC', eventStartDate, eventStartTime, eventEndDate, eventEndTime)
      // "2023-12-24T18:00"

      const stringifyDateTime = (date: string, time: number) => {
        let formattedTime;
        const timeString: string = time.toString()
        
        if (timeString.indexOf('.') === -1){
          formattedTime = `${time}:00`
        } else {
          const hour = timeString.slice(0,2);
          const minute = timeString.slice(3,5);
          let formattedMinute; 

          switch (minute) {
            case '25':
              formattedMinute = '15';
              break;
            case '5': 
              formattedMinute = '30'
              break;
            case '75': 
              formattedMinute = '45'
              break;
          }

         formattedTime = `${hour}:${formattedMinute}`
        }

        return `${date}T${formattedTime}`;
      }

      const startTimeString= stringifyDateTime(eventStartDate, eventStartTime)
      const endTimeString = stringifyDateTime(eventEndDate, eventEndTime)
      console.log('sts,ets', startTimeString, endTimeString)
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
          startTime: new Date(startTimeString),
          endTime: new Date(endTimeString),
          invitees: friendsToInvite,
        }
      })
      console.log(newEvent.data)
    } catch (err) {
      console.error('CLIENT ERROR: failed to POST new event', err)
    }
  }

  const handleRangeChange = (e: any) => {
    const { value, name } = e.target;

    if (name === 'start') {
      setEventStartTime(value);
    }
    else if (name === 'end') {
      setEventEndTime(value);
    }
  }

  const handleDateChange = (e: any) => {
    const { value, name } = e.target;

    if (name === 'start') {
      setEventStartDate(value);
    }
    else if (name === 'end') {
      setEventEndDate(value);
    }
  }

  const handleInputChange = (e: any) => {
    const { value, name } = e.target;

    if (name === 'name') {
      setEventName(value);
    } else if (name === 'description') {
      setEventDescription(value);
    } else if (name === 'address') {
      setEventAddress(value);
    }
  }

  const handleAddressToCoordinates = async (e:any) => {
    const { value } = e.target;
    const coordinatesResponse = await axios.post('/api/events/getCoordinatesFromAddress', {
      address: value
    })

    const [ evtLongitude, evtLatitude] = coordinatesResponse.data;
    setEventLongitude(evtLongitude);
    setEventLatitude(evtLatitude);
  }

  return (
    <Modal show={showCreateModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>{isNewEvent ? 'Create new event' : `${eventName} -- your event`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
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
            />
          </div>
          <div>
            <Form>
              <Form.Group className="mb-5" controlId="formEvent">

          {/* <p>{eventName}</p> */}
                <FloatingLabel
                  controlId="floatingEventNameInput"
                  label="Event Name"
                  className="my-2"
                >
                  <Form.Control type="text" name='name' value={eventName} onChange={handleInputChange} />
                </FloatingLabel>

          {/* <p>{eventDescription}</p> */}
                <FloatingLabel
                  controlId="floatingEventDescriptionInput"
                  label="Description"
                  className="mb-2"
                >
                  <Form.Control type="text" name='description' value={eventDescription} onChange={handleInputChange} />
                </FloatingLabel>

          {/* <p>{eventAddress}</p> */}
                <FloatingLabel
                  controlId="floatingEventAddressInput"
                  label="Address"
                  className="mb-2"
                >
                  <Form.Control type="text" name='address' value={eventAddress} onChange={handleInputChange} onBlur={handleAddressToCoordinates} />
                </FloatingLabel>

          {/* <p>{eventStartDate}</p> */}
                <FloatingLabel
                  controlId="floatingEventStartDateInput"
                  label="Start Date: YYYY-MM-DD"
                  className="my-2"
                >
                  <Form.Control type="text" name="start" value={eventStartDate} onChange={handleDateChange} />
                </FloatingLabel>

                <div style={{ display: 'flex', flexDirection: 'row' }}><p>{eventStartTime}</p>
                  <Form.Range
                    min={0}
                    max={24}
                    value={eventStartTime}
                    name='start'
                    step={.25}
                    onChange={handleRangeChange}
                  /></div>

          {/* <p>{eventEndDate}</p> */}
                <FloatingLabel
                  controlId="floatingEventEndDateInput"
                  label="End Date: YYYY-MM-DD"
                  className="my-2"
                >
                  <Form.Control type="text" name="end" value={eventEndDate} onChange={handleDateChange} />
                </FloatingLabel>

                <div style={{ display: 'flex', flexDirection: 'row' }}><p>{eventEndTime}</p>
                  <Form.Range
                    min={0}
                    max={24}
                    value={eventEndTime}
                    step={.25}
                    name='end'
                    onChange={handleRangeChange}
                  /></div>
              </Form.Group>
            </Form>

            <EventCreateAccordion
              selectedEvent={selectedEvent}
              friends={friends}
              userId={userId}
              isNewEvent={isNewEvent} // passing this thru to accordion to determine whether to get event's people
              setFriendsToInvite={setFriendsToInvite}
              friendsToInvite={friendsToInvite}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isNewEvent && <Button onClick={handleEventCreation}>Create Event</Button>}

        <Button variant="danger" onClick={handleClose}>
          X
        </Button>
      </Modal.Footer>
    </Modal>
  )

};

export default EventCreateModal;