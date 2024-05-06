/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  Map,
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
} from 'react-map-gl';
import { Container, Form, Card, Button, Modal } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaWalking } from '@react-icons/all-files/fa/FaWalking';
import { FaPlusCircle } from '@react-icons/all-files/fa/FaPlusCircle';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PinModal from './PinModal';
import { ThemeContext, RunModeContext } from './Context';

import { io } from 'socket.io-client';
const socket = io();

interface MapProps {
  userLat: number;
  userLng: number;
  userId: number;
  getLocation: any;
  setConfirmActionBundle: any;
}

const MapPage: React.FC<MapProps> = ({
  userLat,
  userLng,
  getLocation,
  userId,
  setConfirmActionBundle,
}) => {
  // ADD userId BACK TO PROPS

  const mapRef = useRef(null);
  // const userId = 7; // ADD THIS BACK TO PROPS AND DELETE THIS WHEN YOU'RE DONE TESTING

  const [searchParams, setSearchParams] = useSearchParams();
  const [isPinSelected, setIsPinSelected] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [filterOn, setFilterOn] = useState<boolean>(false);
  const [filterChoice, setFilterChoice] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number]>([
    userLng,
    userLat,
  ]);
  const [clickedPinCoords, setClickedPinCoords] = useState<[number, number]>([
    0, 0,
  ]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([
    0, 0,
  ]);
  const [routeDirections, setRouteDirections] = useState<any | null>(null);
  const [showRouteDirections, setShowRouteDirections] =
    useState<boolean>(false);
  const [isFriendSelected, setIsFriendSelected] = useState<boolean>(false);
  const [friends, setFriends] = useState([]);

  const theme = useContext(ThemeContext);
  const isDemoMode = useContext(RunModeContext) === 'demo';

  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [showFriendPopup, setShowFriendPopup] = useState<boolean>(false);
  const [shareLoc, setShareLoc] = useState<boolean>();
  const [viewState, setViewState] = useState({
    latitude: 29.964735,
    longitude: -90.054261,
    zoom: 16,
  });

  const [showAboutModal, setShowAboutModal] = useState(true);

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };



  // determines which path to take on route render ie walk, cycle, or drive
  const routeProfiles = [
    { id: 'walking', label: 'Walking' },
    { id: 'cycling', label: 'Cylcing' },
    { id: 'driving', label: 'Driving' },
  ];
  const [selectedRouteProfile, setselectedRouteProfile] =
    useState<string>('walking');

  //determines which pins to show- filter or not filter
  const renderMarkers = filterOn ? filteredMarkers : markers;

  //loads pins immediately on page render
  useEffect(() => {
    getPins();
    getFriends();
    // getEvents();
    isSharingLoc();
  }, [userId]);

  useEffect(() => {
    getLocation();
  }, [userLocation]);

  useEffect(() => {
    getLocation();
  }, [friends]);

  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();
    useEffect(() => {
      geoControlRef.current?.trigger();
    }, [geoControlRef.current]);


  //gets pins from database then removes all personal pins that don't match userId
  const getPins = async () => {
    try {
      const response = await axios.get('/api/pins/get-pins');

      const pins = response.data
        .filter((pin: any) => {
          return pin.isPersonal === true && pin.ownerId === userId;
        })
        .concat(response.data.filter((pin: any) => pin.isPersonal === false));

      setMarkers(pins);
    } catch (err) {
      console.error(err);
    }
  };

  //gets friends from the database
  const getFriends = async () => {
    try {
      const { data } = await axios.get(`/api/friends/getFriends/${userId}`);
      const friends = data.filter((friend: any) => friend.shareLoc === true);
      setFriends(friends);
    } catch (err) {
      console.error(err);
    }
  };

  //sets share Location toggle immediately to respective state on page render
  const isSharingLoc = async () => {
    try {
      const isUserSharingLoc = await axios.get(
        `/api/friends/updateShareLoc/${userId}`
      );
      isUserSharingLoc.data ? setShareLoc(true) : setShareLoc(false);
    } catch (err) {
      console.error(err);
    }
  };

  //handles the share location toggle change and updates the db
  const toggleShareLoc = async () => {
    try {
      await axios.patch('/api/friends/updateShareLoc', {
        options: {
          userId,
          shareLoc: !shareLoc,
        },
      });
    } catch (err) {
      console.error(err);
    }
    isSharingLoc();
  };

  //this useEffect should update user or friend locations everytime they move
  useEffect(() => {
    socket.on('userLoc response', (userLoc) => {
      if (userLoc.id === userId) {
        setUserLocation([userLoc.longitude, userLoc.latitude]); // assuming everytime state is set there is a new render with updated loc
      } else {
        friends.forEach((friend) => {
          if (friend.id === userLoc.id) {
            friend.longitude = userLoc.longitude;
            friend.latitude = userLoc.latitude;
          }
        });
        setFriends((prevFriends) => [...prevFriends]); // assuming everytime state is set there is a new render with updated friend loc
      }
    });
  });

  //handles plus sign button to show createPin modal
  const dropPin = (e: any) => {
    if (isPinSelected === false && isFriendSelected === false) {
      setShowModal(true);
    }
  };

  //finds clicked marker/pin and friend pin from database
  const clickedMarker = async (
    e: any,
    type: string,
    coords: [number, number]
  ) => {
    const currMarkerLng = e._lngLat.lng || e.lngLat.lng;
    const currMarkerLat = e._lngLat.lat || e.lngLat.lat;

    const lngRounded = currMarkerLng.toString().slice(0, 10);
    const latRounded = currMarkerLat.toString().slice(0, 9);
    setClickedPinCoords([lngRounded, latRounded]);

    if (type === 'marker') {
      try {
        const { data } = await axios.get(
          `/api/pins/get-clicked-pin-marker/${coords[0]}/${coords[1]}`
        );
        setSelectedPin(data);
        setIsPinSelected(true);
        setShowDirections(true);
        setIsFriendSelected(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const { data } = await axios.get(
          `/api/pins/get-clicked-friend-marker/${coords[0]}/${coords[1]}`
        );
        setSelectedPin(data);
        setSelectedFriend(data);
        setShowFriendPopup(true);
        setShowDirections(true);
        setIsFriendSelected(true);
        setShowModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // when pin is selected, route and modal are triggered
  useEffect(() => {
    if (clickedPinCoords[0] !== 0) {
      createRouterLine(selectedRouteProfile);
      modalTrigger();
    }
  }, [isPinSelected]);

  // when friend is selected, route is called and friend state is reset
  useEffect(() => {
    if (clickedPinCoords[0] !== 0) {
      createRouterLine(selectedRouteProfile);
      setRouteDirections(true);
      if (isFriendSelected === true) {
        setIsFriendSelected(false);
      }
    }
  }, [isFriendSelected]);

  // these are the details that are being set to build the "route"/ line for the directions
  const makeRouterFeature = (coordinates: [number, number][]): any => {
    const routerFeature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      ],
    };
    return routerFeature;
  };

  // handles the route line creation by making the response from the directions API into a geoJSON
  // which is the only way to use it in the <Source> tag (displays the "route/line")
  const createRouterLine = async (routeProfile: string): Promise<void> => {
    let startCoords : string;
    isDemoMode ? startCoords = `-90.0546585,29.9631183` : startCoords = `${userLocation[0]},${userLocation[1]}`
    const endCoords = `${clickedPinCoords[0]},${clickedPinCoords[1]}`;
    const geometries = 'geojson';
    const url = `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw`;

    try {
      const { data } = await axios.get(url);

      data.routes.map((route: any) => {
        setDistance((route.distance / 1609).toFixed(2)); // meters to miles
        setDuration(route.duration.toFixed(2)); // hours
      });

      const coordinates = data['routes'][0]['geometry']['coordinates'];
      const destinationCoordinates =
        data['routes'][0]['geometry']['coordinates'].slice(-1)[0];
      setDestinationCoords(destinationCoordinates);

      if (coordinates.length) {
        const routerFeature = makeRouterFeature([...coordinates]);
        setRouteDirections(routerFeature);
        setShowRouteDirections(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //prompts the modal to open/close on pin
  const modalTrigger = () => {
    if (isPinSelected === false) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  //converts meters to miles and seconds to hours and minutes
  const humanizedDuration = (duration: number) => {
    duration = Number(duration);
    const h = Math.floor(duration / 3600);
    const m = Math.floor((duration % 3600) / 60);

    const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay =
      m > 0 ? m + (m == 1 ? ' minute ' : ' minutes') : 'Less than 1 min ';

    return `${hDisplay + mDisplay}`;
  };

  //sets pin category color when the pins load on the map
  const pinCategoryColor = (marker: any) => {
    const colorMapping: PinColorMapping = {
      isFree: theme === 'pg-theme-vis' ? '#101010' : '#53CA3C',
      isToilet: theme === 'pg-theme-vis' ? '#196d66' : '#169873',
      isFood: theme === 'pg-theme-vis' ? '#6d6d6d' : '#FCC54E',
      isPersonal: theme === 'pg-theme-vis' ? '#d2b48c' : '#cf40f5',
      isPhoneCharger: theme === 'pg-theme-vis' ? '#aeaeae' : '#53e3d4',
      isPoliceStation: theme === 'pg-theme-vis' ? '#30d5c8' : '#E7ABFF',
      isEMTStation: theme === 'pg-theme-vis' ? '#D3D3D3' : '#f27d52',
    };

    for (const key in marker) {
      if (marker[key] === true) {
        return colorMapping[key];
      }
    }
  };

  // styles the filter buttons
  const filterStyling = (value: string) => {
    const colorMapping: PinColorMapping = {
      isFree: theme === 'pg-theme-vis' ? '	#101010' : '#53CA3C',
      isToilet: theme === 'pg-theme-vis' ? '#196d66' : '#169873',
      isFood: theme === 'pg-theme-vis' ? '#6d6d6d' : '#FCC54E',
      isPersonal: theme === 'pg-theme-vis' ? '#d2b48c' : '#cf40f5',
      isPhoneCharger: theme === 'pg-theme-vis' ? '#aeaeae' : '#53e3d4',
      isPoliceStation: theme === 'pg-theme-vis' ? '#30d5c8' : '#E7ABFF',
      isEMTStation: theme === 'pg-theme-vis' ? '#D3D3D3' : '#f27d52',
    };
    const off = {
      backgroundColor: `${colorMapping[value]}`,
      color:
        theme !== 'pg-theme-vis'
          ? 'black'
          : ['isFree', 'isToilet', 'isFood', 'isPersonal'].includes(value)
          ? 'white'
          : 'black',
      lineHeight: 1,
      width: '25%',
      height: '44px',
      marginBottom: '3px',
    };

    const on = {
      backgroundColor: '#fffcf8',
      color: `${colorMapping[value]}`,
      borderColor: `${colorMapping[value]}`,
      borderWidth: '1px',
      borderStyle: 'solid',
      lineHeight: 1,
      width: '25%',
      height: '44px',
      marginBottom: '3px',
    };

    if (value === filterChoice && filterOn === true) {
      return on;
    } else {
      return off;
    }
  };

  // manages the rendering for the filter element
  const filterResults = (e: string) => {
    setFilterOn(false);
    const choice = e;

    const filteredPins = markers.filter((marker) => {
      for (const key in marker) {
        if (marker[choice] === true) {
          return marker;
        }
      }
    });

    setFilterOn(true);
    setFilterChoice(choice);
    setFilteredMarkers(filteredPins);
  };

  return (
    <Container className={`body ${theme} map-page-container`}>
      {isDemoMode && (
        <Modal show={showAboutModal} onHide={toggleAboutModal}>
          <Modal.Header closeButton>
            <Modal.Title>DEMO MODE: Map Page</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='fs-6 lh-sm'>
              <b>Welcome to the Map page!</b>
              <br />
              <br />
              The map displays pins indicating points of interest like food
              stalls, bathrooms, EMT&apos;s and police personnel. All pins are
              added by Pardi Gras users, and each pin is accompanied by an image
              to verify the pin&apos;s contents.
              <br />
              <br />
              Users can also add supplemental pictures to a pin to document how
              a point of interest has changed since the original pin was
              dropped. Clicking on a pin displays any photos tied to it, after
              which walking directions to the pin and an estimated travel
              duration are drawn on the map.
              <br />
              <br />
              Your Krewe members will also appear on the map if they opt in to
              location sharing.
              <br />
              <br />
              <b>We&apos;d love your feedback!</b> Take the{' '}
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
      {showModal ? (
        <PinModal
          userId={userId}
          setShowModal={setShowModal}
          markers={markers}
          setMarkers={setMarkers}
          isPinSelected={isPinSelected}
          selectedPin={selectedPin}
          setSelectedPin={setSelectedPin}
          setIsPinSelected={setIsPinSelected}
          userLocation={userLocation}
          setConfirmActionBundle={setConfirmActionBundle}
          getPins={getPins}
        />
      ) : null}
      <Form.Switch
        type='switch'
        id='share-location-switch'
        label={
          shareLoc
            ? 'Sharing Location with Friends'
            : 'Not Sharing Location with Friends'
        }
        onClick={() => toggleShareLoc()}
        defaultChecked={shareLoc}
        className = 'my-3'
        disabled={isDemoMode}
      />
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken='pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw'
        style={{
          position: 'relative',
          bottom: '0px',
          maxWidth: '100vw',
          height: '80vh',
        }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
      >
      {isDemoMode ?
        <Marker longitude={-90.0546585} latitude={29.9631183} anchor='bottom' style={{color: "red"}}>
          YOU<br/>
          ARE <br/>
          HERE <br/>
        </Marker> :
        <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        showUserHeading={true}
        showUserLocation={true}
        showAccuracyCircle={false}
        ref={geoControlRef}
        />
      }
        <div id='map-markers'>
          {renderMarkers.map((marker) => (
            <Marker
              key={marker.id}
              onClick={(e) => {
                clickedMarker(e.target, 'marker', [
                  marker.longitude,
                  marker.latitude,
                ]);
              }}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor='bottom'
              color={pinCategoryColor(marker)}
            ></Marker>
          ))}
        </div> */}
        {/* <div id='friend-markers'>
          {friends.map((friend) => (
            <Marker
              key={friend.id}
              onClick={(e) => {
                clickedMarker(e.target, 'friend', [
                  friend.longitude,
                  friend.latitude,
                ]);
              }}
              longitude={friend.longitude}
              latitude={friend.latitude}
              anchor='bottom'
            >
              <div style={{ textAlign: 'center' }}>
                <b>
                  {friend.firstName[0]}
                  {friend.lastName[0]}
                </b>
                <br />
                <img src='img/pgLogo.png' width='45px' height='55px' />
              </div>
            </Marker>
          ))}
        </div> */}
        {/* <div id='event-markers'>
        {
          events.map((event) => (
            <Marker
            key={event.id}
            onClick={(e) => {clickedMarker(e.target)}}
            longitude={event.longitude} latitude={event.latitude}
            anchor="bottom"
            color="#ffbdf0">
            </Marker>
          ))
        }
      </div> */}
        {showRouteDirections ? (
          <Source id='line1' type='geojson' data={routeDirections}>
            <Layer
              id='routerLine01'
              type='line'
              paint={{
                'line-color': '#cf40f5',
                'line-width': 3,
              }}
            />
          </Source>
        ) : null}
        <NavigationControl />
        {showFriendPopup ? (
          <Popup
            longitude={selectedFriend.longitude}
            latitude={selectedFriend.latitude}
            anchor='top'
            closeOnMove={true}
            onClose={() => setShowFriendPopup(false)}
          >
            <b>
              {selectedFriend.firstName} {selectedFriend.lastName}
            </b>
          </Popup>
        ) : null}
        {showDirections && (
          <Card id='map-direction-card'>
            <Card.Body className='text-center'>
              <p>
                <b>{humanizedDuration(duration)}</b>
              </p>
              <p>
                {distance} miles
              </p>
              <div className='d-flex flex-row justify-content-between align-items-center mx-2'>
                <FaWalking
                  style={{
                    color: '#cf40f5',
                    width: '25px',
                    height: '30px',
                  }}
                />
                <Button
                  size='sm'
                  variant='primary'
                  className='btn-sm'
                  onClick={() => {
                    setShowDirections(false);
                    setShowRouteDirections(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
        {/* <button
          onClick={(e) => {
            dropPin(e);
          }}
        >
          <FaPlusCircle
            style={{
              color: theme === 'pg-theme-vis' ? '#291F1F' : '#cf40f5',
              width: '60px',
              height: '60px',
              border: '5px solid #E7ABFF',
              borderRadius: '50%',
              position: 'absolute',
              right: '5%',
              bottom: '8%',
            }}
          />
        </button> */}
      </Map>
      {/* <div id='map-filter-container' className='container'>
        <p style={{ textAlign: 'center' }}>FILTER PINS</p>
        <div
          className='filter-buttons'
          style={{ flexWrap: 'wrap', textAlign: 'center' }}
        >
          <button
            type='button'
            style={filterStyling('isFree')}
            value='isFree'
            className='btn'
            onClick={(e) => {
              filterResults(e.currentTarget.value);
            }}
          >
            Free Toilets
          </button>
          <button
            type='button'
            style={filterStyling('isToilet')}
            value='isToilet'
            className='btn'
            onClick={(e) => {
              filterResults(e.currentTarget.value);
            }}
          >
            Pay for Toilet
          </button>
          <button
            type='button'
            style={filterStyling('isFood')}
            value='isFood'
            className='btn'
            onClick={(e) => {
              filterResults(e.currentTarget.value);
            }}
          >
            Food
          </button>
          <button
            type='button'
            style={filterStyling('isPersonal')}
            value='isPersonal'
            className='btn'
            onClick={(e) => {
              filterResults(e.currentTarget.value);
            }}
          >
            Personal
          </button>
          <button
            type='button'
            style={filterStyling('isPhoneCharger')}
            value='isPhoneCharger'
            className='btn'
            onClick={(e) => {
              filterResults(e.currentTarget.value);
            }}
          >
            Phone Charger
          </button>
          <button
            type='button'
            style={filterStyling('isPoliceStation')}
            value='isPoliceStation'
            className='btn'
            onClick={(e) => {
              filterResults(e.currentTarget.value);
            }}
          >
            Police Station
          </button>
          <button
            type='button'
            style={filterStyling('isEMTStation')}
            value='isEMTStation'
            className='btn'
            onClick={(e) => {
              filterResults(e.currentTarget.value);
            }}
          >
            EMT Station
          </button>
        </div>
        <Button
          type='button'
          value='clearFilters'
          className='btn btn-wide'
          onClick={() => {
            setFilterOn(false);
            filterStyling(filterChoice);
          }}
        >
          Clear Filter
        </Button>
      </div> */}
    </Container>
  );
};

interface PinColorMapping {
  [key: string]: string;
  isFree: string;
  isToilet: string;
  isFood: string;
  isPersonal: string;
  isPhoneCharger: string;
  isPoliceStation: string;
  isEMTStation: string;
}

export default MapPage;

// FOR L8R: gets owned and participating events from database
// const getEvents = async () => {
//   const endpoints = [`/api/events/getEventsOwned/${userId}`, `/api/events/getEventsParticipating/${userId}`]
//   try {
//     await axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
//       (events) => {events.map((responseEvent) => setEvents(responseEvent.data))} );
//   } catch (err)  {
//       console.error(err)
//   }
// }
