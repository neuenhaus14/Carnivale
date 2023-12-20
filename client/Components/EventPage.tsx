import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventBasicModal from './EventBasicModal';
import axios from 'axios';
import dayjs from "dayjs";

interface EventPageProps {
  getLocation: any,
  lng: number,
  lat: number,
  userId: number,
}

const EventPage: React.FC<EventPageProps> = ({ getLocation, lng, lat, userId }) => {

  const [searchParams] = useSearchParams();
  // const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [friends, setFriends] = useState([]); // will be passed to modal to manage invites

  const [selectedEvent, setSelectedEvent] = useState({ latitude: 0, longitude: 0, startTime: null, endTime: null })
  const [isUserAttending, setIsUserAttending] = useState(false)

  const [allPublicEvents, setAllPublicEvents] = useState([]);
  const [eventsParticipating, setEventsParticipating] = useState([{ name: 'event1' }]);
  const [eventsInvited, setEventsInvited] = useState([{ name: 'event2' }])

  const [showBasicModal, setShowBasicModal] = useState(false)

  // get array of public event ids that the user is attending
  const getEventsInvited = async () => {
    try {
      const publicEventsInvited = await axios.get(`/api/events/getPublicEventsInvited/${userId}`)
      setEventsInvited(publicEventsInvited.data)
      console.log('pubEventsInvited', publicEventsInvited.data)
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user\'s public event invitations', err)
    }
  }

  // get array of public event ids that the user is invited to
  const getEventsParticipating = async () => {
    try {
      const publicEventsParticipating = await axios.get(`/api/events/getPublicEventsParticipating/${userId}`);
      setEventsParticipating(publicEventsParticipating.data);
      console.log('pubEventsParticipating', publicEventsParticipating.data)
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user\'s public participating events', err);
    }
  }

  // get all public events
  const getAllPublicEvents = async () => {
    try {
      const allPublicEventsResponse = await axios.get('/api/events/getAllPublicEvents');

      // console.log('all public', allPublicEventsResponse)

      setAllPublicEvents(allPublicEventsResponse.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to get all public events');
    }
  }

  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`)
      // console.log('here', friends.data);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err)
    }
  }
  //drop down for choosing a date to get search data into scrapeEvents

  // location
  useEffect(() => {
    getLocation();
    getEventsInvited();
    getEventsParticipating();
    getAllPublicEvents();
    getFriends();
  }, [isUserAttending, selectedEvent, userId])


  const allPublicEventItems = allPublicEvents.map((event: any, index: number) => {
    return <ul
      key={index}
      style={{
        color: eventsParticipating.includes(event.id) ? 'green'
          : eventsInvited.includes(event.id) ? 'orange' : 'black'
        
      }}
      onClick={() => {
        setShowBasicModal(true);
        setSelectedEvent(event);
        // enables invite ability if user is participating
        if (eventsParticipating.includes(event.id)) {
          setIsUserAttending(true);
        }
      }}
    >
     <h4>{event.name}</h4>
     <h5>{event.address}</h5>
    <h6>{dayjs(event.startTime).format(' MMMM D, YYYY h:mm')}
</h6>
    </ul>
  })

  // console.log('inside eventPage. isUserAttending', isUserAttending)
  return (
    <div>
      <h1>EventPage! {`${lng}, ${lat}`}</h1>
      {allPublicEventItems}
      <EventBasicModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowBasicModal={setShowBasicModal}
        showBasicModal={showBasicModal}
        friends={friends}
        userId={userId}
        isUserAttending={isUserAttending}
        setIsUserAttending={setIsUserAttending}
        getEventsInvited={getEventsInvited}
        getEventsParticipating={getEventsParticipating}
      />
    </div>

  )

};

export default EventPage;