import React, { useEffect, useState, useContext } from 'react';
import EventCreateModal from './EventCreateModal';
import axios from 'axios';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, Modal, Button, Container } from 'react-bootstrap';
import { ThemeContext, RunModeContext } from './Context';
interface EventPageProps {
  lng: number;
  lat: number;
  userId: number;
}

const EventPage: React.FC<EventPageProps> = ({ lng, lat, userId }) => {
  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo'
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

  const [showAboutModal, setShowAboutModal] = useState(true);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

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
        <Card.Text as='div'>
          <p className='card-content'>{event.name}</p>
          <p className='card-detail'>{event.address}</p>
          <p className='card-detail'>
            {dayjs(event.startTime).format(' MMMM D, YYYY h:mm') + 'pm'}
          </p>
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
    <Container className={`body ${theme}`} onClick={toggleAboutModal}>
      <div className='gig-body-calendar'>
        <div
          className='select-gig-date-container'
          // style={{ position: 'fixed', bottom: '11.4vh', zIndex: 1 }}
        >
          <h3 className='date-picker-name'>Select the Date:</h3>

          <DatePicker
            className='date-picker'
            popperPlacement='bottom'
            selected={date}
            onChange={(date: Date) => setDate(date)}
          />
        </div>
        {isDemoMode && <Modal show={showAboutModal} onHide={toggleAboutModal}>
          <Modal.Header closeButton>
            <Modal.Title>DEMO MODE: Live Music</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='fs-6 lh-sm'>
              <b>Welcome to the Live Music calendar!</b>
              <br />
              <br />
              Discover upcoming live music in New Orleans by selecting a date at
              the bottom of the page. Clicking a gig opens a panel for creating
              a custom event with the gig&apos;s details prepopulated, and you can update those details as needed.
              <br />
              <br />
              <b>Got something to say?</b> Take the{' '}
              <a href='https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform'>
                Survey
              </a>{' '}
              and let us know what you think!
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={toggleAboutModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>}
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
          getEventsOwned={() => {}}
        />
        <footer className='footer' style={{ padding: 15 }}>
          Live music info courtesy of{' '}
          <a href='https://www.wwoz.org/calendar/livewire-music'>WWOZ</a>
        </footer>
      </div>
    </Container>
  );
};

export default EventPage;
