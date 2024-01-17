import React, { useEffect, useState, useContext } from 'react';
import EventCreateModal from './EventCreateModal';
import axios from 'axios';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card } from 'react-bootstrap';
import { ThemeContext } from './Context';
interface EventPageProps {
  lng: number;
  lat: number;
  userId: number;
}

const EventPage: React.FC<EventPageProps> = ({
  lng,
  lat,
  userId,
}) => {
  const theme = useContext(ThemeContext)
  // const [searchParams] = useSearchParams();
  // const [userId] = useState(Number(searchParams.get('userid')) || 1);
  const [friends, setFriends] = useState([]); // will be passed to modal to manage invites

  const [selectedEvent, setSelectedEvent] = useState({
    latitude: 0,
    longitude: 0,
    startTime: null,
    endTime: null,
  });
  const [isUserAttending, setIsUserAttending] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allGigs, setAllGigs] = useState([]);
  const [isNewEvent, setIsNewEvent] = useState(true);
  const [date, setDate] = useState(new Date());

  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err);
    }
  };

  // location
  useEffect(() => {
    if (userId) {
      getFriends();
    }
  }, [isUserAttending, selectedEvent, userId]);

  const allGigItems = allGigs.map((event, index: number) => {
    return (
      <Card
        key={index}
        onClick={async () => {
          await setSelectedEvent(event);
          await setIsNewEvent(true);
          await setShowCreateModal(true);
        }}
      >
        <Card.Text as="div">
          <p className='card-content'>{event.name}</p>
          <p className='card-detail'>{event.address}</p>
          <p className='card-detail'>{dayjs(event.startTime).format(' MMMM D, YYYY h:mm') + 'pm'}</p>
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

  return (
    <div className={`body ${theme}`}>
      <h3 className='date-picker'>Select the Date</h3>
      <div
      style={{
        textAlign: "center",
        marginTop: "10px",
        position: "sticky",
        top: "73px",
        zIndex: 2000,
      }}>
      <DatePicker
        className='date-picker'
        popperPlacement='bottom'
        selected={date}
        onChange={(date: Date) => setDate(date)}
      />
      </div>
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
      />
      <footer className='footer'>Live music info courtesy of <a href='https://www.wwoz.org/calendar/livewire-music'>WWOZ</a></footer>
    </div>
  );
};

export default EventPage;
