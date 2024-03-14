import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import EventCreateModal from './EventCreateModal';
import { Card, Button, Container, Modal, Form } from 'react-bootstrap';
import { FaPlusCircle } from '@react-icons/all-files/fa/FaPlusCircle';
import { FaRoute } from '@react-icons/all-files/fa/FaRoute';

import { ThemeContext, RunModeContext } from './Context';

interface ParadeInfo {
  title: string;
  startDate: string;
  location: string;
  imageSrc: string;
  imageParade: string;
  paradeInfo: string;
  directionsText: string;
  otherParades: string;
  mapLink: string;
}

interface ParadeProps {
  lng: number;
  lat: number;
  userId: number;
}

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface WeatherDay {
  date: string;
  day: {
    maxtemp_f: number;
    mintemp_f: number;
    daily_chance_of_rain: number;
    condition: WeatherCondition;
  };
}

interface WeatherForecast {
  forecast: {
    forecastday: WeatherDay[];
  };
}

const Parade: React.FC<ParadeProps> = ({ userId, lng, lat }) => {
  const [paradeInfo, setParadeInfo] = useState<ParadeInfo | null>(null);
  const [selectedParade, setSelectedParade] = useState<string | null>(null);
  const [paradeList, setParadeList] = useState<string[]>([]);
  const [weatherForecast, setWeatherForecast] =
    useState<WeatherForecast | null>(null);

  // state needed for create event modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  // determines whether creating or updating
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({
    latitude: 0,
    longitude: 0,
    startTime: null,
    endTime: null,
  });

  const [showAboutModal, setShowAboutModal] = useState(true);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';

  // need to get friends in order to know
  // who we can invite to the event being created
  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`);
      setFriends(friends.data);
    } catch (err) {
      console.error('CLIENT ERROR: failed to GET user friends', err);
    }
  };

  const fetchParadeInfo = async (paradeName: string) => {
    try {
      const response = await axios.get<ParadeInfo>(
        `/api/parades/parade-info/${paradeName}`
      );
      setParadeInfo(response.data);
    } catch (error) {
      console.error('Error fetching parade information:', error.message);
    }
  };

  const fetchParadeList = async () => {
    try {
      const response = await axios.get<{ parades: string[] }>(
        '/api/parades/parade-list'
      );
      setParadeList(response.data.parades);
    } catch (error) {
      console.error('Error fetching parade list:', error.message);
    }
  };

  const handleParadeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedParadeName = event.target.value;
    const formattedParadeName = encodeURIComponent(
      selectedParadeName.replace(/\s+/g, '-').toLowerCase()
    );

    try {
      // Fetch parade information
      const paradeResponse = await axios.get<ParadeInfo>(
        `/api/parades/parade-info/${formattedParadeName}`
      );

      setParadeInfo(paradeResponse.data);
      setSelectedParade(selectedParadeName);

      // Format the date to "YYYY-MM-DD"
      const formattedDate = dayjs(paradeResponse.data.startDate).format(
        'YYYY-MM-DD'
      );

      // Fetch weather data for the selected date
      const weatherResponse = await axios.get(
        `/api/weather/forecast/${formattedDate}`
      );
      setWeatherForecast(weatherResponse.data);
    } catch (error) {
      console.error(
        'Error fetching parade or weather information:',
        error.message
      );
    }
  };

  useEffect(() => {
    fetchParadeList();

    userId && getFriends();
  }, [userId]);

  return (
    <Container className={`body-with-bottom-panel ${theme} parade-page-container`} style={{ paddingBottom: '170px' }}>
      <div className='gig-body-calendar'>
        {isDemoMode && (
          <Modal show={showAboutModal} onHide={toggleAboutModal}>
            <Modal.Header closeButton>
              <Modal.Title>DEMO MODE: Parades Page</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className='fs-6 lh-sm'>
                <b>Welcome to the Parades page!</b>
                <br />
                <br />
                Here you&apos;ll find all the details about upcoming parades to
                help you coordinate your Mardi Gras. <br />
                <br />
                Select a parade from the options dropdown to see the time, date,
                route, history, and weather forecast for the selection, and
                discover which parades roll on the same day at the bottom of the
                listing. Then click the &apos;⊕&apos; button to create an custom
                event - the parade&apos;s details will prepopulate the form, but
                can be changed if desired.
                <br />
                <br />
                <b>One last thing!</b> Take the{' '}
                <a href='https://docs.google.com/forms/d/e/1FAIpQLSfSGLNva3elpadLqpXw1WuD9b4H39lBuX6YMiKT5_o2DNQ7Gg/viewform'>
                  Survey
                </a>{' '}
                and let us know what you think.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={toggleAboutModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <div id='select-parade-container' className='page-bottom-panel'>
          <Button
            disabled={!selectedParade}
            variant='primary'
            onClick={async () => {
              await setIsNewEvent(true);
              await setShowCreateModal(true);
              await setSelectedEvent({
                ...paradeInfo,
                latitude: 0,
                longitude: 0,
                endTime: null,
                startTime: null,
              });
            }}
          >
            Make Plans
          </Button>

          <Form.Select
            className='mx-2'
            id='parade-select'
            onChange={handleParadeChange}
            value={selectedParade || ''}
          >
            <option
              value=''
              disabled
              style={{ display: selectedParade ? 'none' : 'block' }}
            >
              Select a parade
            </option>

            {paradeList.map((paradeName) => (
              <option key={paradeName} value={paradeName}>
                {paradeName}
              </option>
            ))}
          </Form.Select>
        </div>

        {paradeInfo && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>{paradeInfo.title}</h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              {paradeInfo.imageParade ? (
                <img
                  src={`https://www.mardigrasneworleans.com${paradeInfo.imageParade}`}
                  alt='Parade Logo'
                  style={{
                    height: '150px',
                    width: '150px',
                    marginRight: '10px',
                  }}
                />
              ) : (
                <img
                  src='img/jesterPin.png'
                  alt='Default Parade Logo'
                  style={{
                    height: '150px',
                    width: '150px',
                    marginRight: '10px',
                  }}
                />
              )}
              <div style={{ textAlign: 'left' }}>
                <h4>Start Time: </h4>
                <p
                  style={{
                    margin: '-2px',
                    marginTop: '-10px',
                    marginBottom: '5px',
                  }}
                >
                  {dayjs(paradeInfo.startDate).format('MMMM D YYYY, h:mm A')}
                </p>
                <h4>Parade Location:</h4>
                <p
                  style={{
                    margin: '-2px',
                    marginTop: '-10px',
                    marginBottom: '5px',
                  }}
                >
                  {' '}
                  {paradeInfo.location}
                </p>
              </div>
            </div>

            <img
              src={`https://www.mardigrasneworleans.com${paradeInfo.imageSrc}`}
              alt='Parade Map'
              style={{
                maxWidth: '100%',
                height: 'auto',
                marginTop: '10px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            {weatherForecast &&
            weatherForecast.forecast &&
            weatherForecast.forecast.forecastday.length > 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '30px',
                  marginBottom: '20px',
                }}
              >
                <h3>Weather Forecast</h3>
                {weatherForecast?.forecast?.forecastday.map(
                  (forecastDay: WeatherDay) => (
                    <div
                      key={forecastDay.date}
                      style={{ textAlign: 'center', marginBottom: '5px' }}
                    >
                      <div
                        style={{
                          margin: '3px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={`https:${forecastDay.day.condition.icon}`}
                          alt={`Weather Icon for ${forecastDay.date}`}
                          style={{ marginRight: '5px' }}
                        />
                        {forecastDay.day.condition.text}
                      </div>
                      <div
                        style={{
                          margin: '1px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ marginRight: '5px' }}>
                          High: {forecastDay.day.maxtemp_f} °F
                        </span>
                        <span>Low: {forecastDay.day.mintemp_f} °F</span>
                      </div>
                      <p style={{ margin: '1px 0', fontSize: '1rem' }}>
                        Chance of Rain: {forecastDay.day.daily_chance_of_rain}%
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div>
                <h3>Weather Forecast</h3>
                <p>No Weather Data Available</p>
              </div>
            )}

            <h3>Parade History</h3>
            <p>
              {paradeInfo.paradeInfo
                .replace(/(Year founded:)/g, ', $1')
                .replace(/(Membership:)/g, ', $1')
                .replace(/(Number of floats:)/g, ', $1')
                .replace(/(Floats by Kern Studios »)/g, ', $1')}
            </p>
            <h3>Parade Directions</h3>
            <p>{paradeInfo.directionsText}</p>
            <h3>
              Other Parades on{' '}
              {dayjs(paradeInfo.startDate).format('MMMM D YYYY')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {paradeInfo.otherParades
                .split('\n')
                .filter(
                  (parade) =>
                    !parade.includes(
                      `Parades On ${dayjs(paradeInfo.startDate).format(
                        'MMM D'
                      )}`
                    )
                )
                .map((parade) => (
                  <Button
                    key={parade}
                    onClick={() =>
                      fetchParadeInfo(parade.replace(/\s+/g, '-').toLowerCase())
                    }
                    style={{ marginRight: '10px', marginBottom: '10px' }}
                  >
                    {parade}
                  </Button>
                ))}
            </div>

            <p>
              <FaRoute />
              <a
                href={paradeInfo.mapLink}
                target='_blank'
                rel='noopener noreferrer'
                style={{ marginLeft: '5px', marginRight: '5px' }}
              >
                View Parade Route
              </a>
              <FaRoute style={{ transform: 'scaleX(-1)' }} />
            </p>
          </div>
        )}

        <EventCreateModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setShowCreateModal={setShowCreateModal}
          showCreateModal={showCreateModal}
          friends={friends}
          userId={userId}
          // isUserAttending={isUserAttending}
          // setIsUserAttending={setIsUserAttending}
          // getEventsInvited={getEventsInvited}
          // getEventsParticipating={getEventsParticipating}
          isNewEvent={isNewEvent}
          setIsNewEvent={setIsNewEvent}
          lat={lat}
          lng={lng}
          //getLocation={getLocation}
          eventType={'parade'}
          getEventsOwned={() => {}} // not needed for parades
        />
        <footer className='footer'>
          Parade info courtesy of{' '}
          <a href='https://www.mardigrasneworleans.com/parades/'>
            Mardi Gras New Orleans
          </a>
        </footer>
      </div>
    </Container>
  );
};

export default Parade;
