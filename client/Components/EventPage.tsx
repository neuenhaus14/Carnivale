import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCreateModal from './EventCreateModal';
import axios from 'axios';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card } from 'react-bootstrap';

interface EventPageProps {
  getLocation: any;
  lng: number;
  lat: number;
  userId: number;
}

const EventPage: React.FC<EventPageProps> = ({
  getLocation,
  lng,
  lat,
  userId,
}) => {
  const [searchParams] = useSearchParams();
  // const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [friends, setFriends] = useState([]); // will be passed to modal to manage invites

  const [selectedEvent, setSelectedEvent] = useState({
    latitude: 0,
    longitude: 0,
    startTime: null,
    endTime: null,
  });
  const [isUserAttending, setIsUserAttending] = useState(false);

  // const [allPublicEvents, setAllPublicEvents] = useState([]);
  // const [eventsParticipating, setEventsParticipating] = useState([{ name: 'event1' }]);
  // const [eventsInvited, setEventsInvited] = useState([{ name: 'event2' }])

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allGigs, setAllGigs] = useState([]);
  const [isNewEvent, setIsNewEvent] = useState(true);
  const [date, setDate] = useState(new Date());

  // get array of public event ids that the user is attending
  // const getEventsInvited = async () => {
  //   try {
  //     const publicEventsInvited = await axios.get(`/api/events/getPublicEventsInvited/${userId}`)
  //     setEventsInvited(publicEventsInvited.data)
  //     console.log('pubEventsInvited', publicEventsInvited.data)
  //   } catch (err) {
  //     console.error('CLIENT ERROR: failed to GET user\'s public event invitations', err)
  //   }
  // }

  // get array of public event ids that the user is invited to
  // const getEventsParticipating = async () => {
  //   try {
  //     const publicEventsParticipating = await axios.get(`/api/events/getPublicEventsParticipating/${userId}`);
  //     setEventsParticipating(publicEventsParticipating.data);
  //     console.log('pubEventsParticipating', publicEventsParticipating.data)
  //   } catch (err) {
  //     console.error('CLIENT ERROR: failed to GET user\'s public participating events', err);
  //   }
  // }

  // get all public events
  // const getAllPublicEvents = async () => {
  //   try {
  //     const allPublicEventsResponse = await axios.get('/api/events/getAllPublicEvents');

  //     // console.log('all public', allPublicEventsResponse)

  //     setAllPublicEvents(allPublicEventsResponse.data);
  //   } catch (err) {
  //     console.error('CLIENT ERROR: failed to get all public events');
  //   }
  // }

  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`);
      // console.log('here', friends.data);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err);
    }
  };
  //drop down for choosing a date to get search data into scrapeEvents

  // location
  useEffect(() => {
    // getLocation();
    //getEventsInvited();
    //getEventsParticipating();
    //getAllPublicEvents();
    if (userId) {
      getFriends();
    }
  }, [isUserAttending, selectedEvent, userId]);

  const allGigItems = allGigs.map((event, index: number) => {
    return (
      <Card
        key={index}
        onClick={async () => {
          console.log('CLICKED ON ITEM');
          await setSelectedEvent(event);
          await setIsNewEvent(true);
          await setShowCreateModal(true);
        }}
      >
        <Card.Text>
          <div className='card-content'>{event.name}</div>
          <div className='card-detail'>{event.address}</div>
          <div className='card-detail'>{dayjs(event.startTime).format(' MMMM D, YYYY h:mm') + 'pm'}</div>
        </Card.Text>
      </Card>
    );
  });
  //scraping logic

  async function scrapeEventsActivate() {
    const userDate = dayjs(date).format('YYYY-MM-DD');
    const scrape = await axios.get(`/api/gigs/gigs-list/${userDate}`);
    setAllGigs(scrape.data.mainArr);
  }
  //use effect for scraping
  useEffect(() => {
    scrapeEventsActivate();
  }, [date]);

  // console.log('inside eventPage. isUserAttending', isUserAttending)
  return (
    <div className='body'>
      <h3 className='date-picker'>Select the Date</h3>
      <DatePicker
        className='date-picker'
        popperPlacement='bottom'
        selected={date}
        onChange={(date: Date) => setDate(date)}
      />
      {allGigItems}
      <EventCreateModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setShowCreateModal={setShowCreateModal}
        showCreateModal={showCreateModal}
        friends={friends}
        userId={userId}
        isNewEvent={isNewEvent}
        setIsNewEvent={setIsNewEvent}
        lat={lat}
        lng={lng}
        eventType={'gig'}
        getEventsOwned={null}
        //isUserAttending={isUserAttending}
        //setIsUserAttending={setIsUserAttending}
        //getEventsInvited={getEventsInvited}
        //getEventsParticipating={getEventsParticipating}
      />
      <footer className='footer'>Live music info courtesy of <a href='https://www.wwoz.org/calendar/livewire-music'>WWOZ</a></footer>
    </div>
  );
};

export default EventPage;
