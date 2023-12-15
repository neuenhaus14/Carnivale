import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventBasicModal from './EventBasicModal';
import axios from 'axios';


interface EventPageProps {
  getLocation: any,
  lng: number,
  lat: number,
}

const EventPage: React.FC<EventPageProps> = ({getLocation, lng, lat}) => {
  
  const [searchParams] = useSearchParams();
  const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [friends, setFriends] = useState([]);
  
  const [selectedEvent, setSelectedEvent] = useState({ latitude: 0, longitude: 0, startTime: null, endTime: null })
  const [isUserAttending, setIsUserAttending] = useState(false)
  
  const [eventsParticipating, setEventsParticipating] = useState([{ name: 'event1' }]);
  const [eventsInvited, setEventsInvited] = useState([{ name: 'event2' }])
  
  const [showBasicModal, setShowBasicModal] = useState(false)

  // specifically for public events
  const getEventsInvited = async () => {
    const publicEventsInvited = await axios.get(`/api/events/getPublicEventsParticipating/${userId}`)
    setEventsInvited(publicEventsInvited.data)
  }

  // specifically for public events
  const getEventsParticipating = async () => {
    const publicEventsParticipating = await axios.get(`/api/events/getPublicEventsInvited/${userId}`)
    setEventsParticipating(publicEventsParticipating.data);
  }



  // location
  useEffect(() => {
    getLocation()
    getEventsInvited()
    getEventsParticipating()
  }, [])





  return (
    <div>
      <h1>EventPage! {`${lng}, ${lat}`}</h1>

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