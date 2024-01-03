/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl, GeolocateControl, Source, Layer, Popup } from 'react-map-gl';
import { Container } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PinModal from './PinModal';

import { io } from 'socket.io-client';
const socket = io();

interface MapProps {
  userLat: number
  userLng: number
  userId: number
  getLocation: any
}

const MapPage: React.FC<MapProps> = ({userLat, userLng, userId, getLocation}) => {

  const mapRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isPinSelected, setIsPinSelected] = useState<boolean>(false)
  const [selectedPin, setSelectedPin] = useState({})
  const [showModal, setShowModal] = useState<boolean>(false)
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([])
  const [filterOn, setFilterOn] = useState<boolean>(false)
  const [filterChoice, setFilterChoice] = useState<string>('')
  const [userLocation, setUserLocation] = useState<[number, number]>([userLng, userLat]);
  const [clickedPinCoords, setClickedPinCoords] = useState<[number, number]>([0, 0])
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([0, 0]);
  const [routeDirections, setRouteDirections] = useState<any | null>(null);
  const [showRouteDirections, setShowRouteDirections] = useState<boolean>(false)
  const [isFriendSelected, setIsFriendSelected] = useState<boolean>(false)
  const [friends, setFriends] = useState([])
  const [events, setEvents] = useState([])
  const [showDirections, setShowDirections]= useState<boolean>(false);
  const [showFriendPopup, setShowFriendPopup] = useState<boolean>(true);
  const [viewState, setViewState] = useState({
    latitude: 29.964735,
    longitude: -90.054261,
    zoom: 16,
  });

  // determines which path to take on route render ie walk, cycle, or drive
  const routeProfiles = [
    {id: 'walking', label: 'Walking'},
    {id: 'cycling', label: 'Cylcing'},
    {id: 'driving', label: 'Driving'},
  ];
  const [selectedRouteProfile, setselectedRouteProfile] = useState<string>('walking');

  //determines which pins to show- filter or not filter 
  const renderMarkers = filterOn ? filteredMarkers : markers

  //loads pins immediately on page render
  useEffect(() => {
    getPins();
   // getFriends();
    getEvents();
  }, [setMarkers]);


 useEffect(() => { 
  getLocation()
  console.log('getLocation called in useEffect')
 }, [setUserLocation])

 
  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();
  useEffect(() => {
    geoControlRef.current?.trigger();
    console.log('getLocation called in geoLocation')
  }, [geoControlRef.current]);

  //gets pins from database then removes all personal pins that don't match userId
  const getPins = async () => {
    try {
      const response = await axios.get('/api/pins/get-pins')

      const pins = response.data.filter((pin: any) => {
        return pin.isPersonal === true && pin.ownerId === userId
      }).concat(response.data.filter((pin: any) => pin.isPersonal === false))
     
      setMarkers(pins);

    } catch (err)  {
      console.error(err)
    }
  }

  //gets owned and participating events from database
  const getEvents = async () => {
    const endpoints = [`/api/events/getEventsOwned/${userId}`, `/api/events/getEventsParticipating/${userId}`]
    try {
      await axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
        (events) => {events.map((responseEvent) => setEvents(responseEvent.data))} );
    } catch (err)  {
        console.error(err)
    }
  }

  // //gets friends from the database- commented out bc friend sockets
  // const getFriends = async () => {
  //   try {
  //     const friends = await axios.get(`/api/friends/getFriends/${userId}`)
  //     setFriends(friends.data)
  //   } catch (err)  {
  //     console.error(err)
  //   }
  // }

  //this useEffect should update user or friend locations everytime they move
  useEffect(() => {
    socket.on('userLoc response', (userLoc) => {
      console.log('userLoc response in map', userLoc)

      if (userLoc.id === userId){
        setUserLocation([userLoc.longitude, userLoc.latitude]) // assuming everytime state is set there is a new render with updated loc
        console.log('userLoc set')

      } else { 
        console.log('made it to else statement in socket')
        friends.forEach((friend) => {
          console.log('friend inside socket', friend)
          if (friend.id === userLoc.id){
            friend.longitude = userLoc.longitude
            friend.latitude = userLoc.latitude
            console.log('friendID that matched', friend)
          }
        })
        setFriends(prevFriends => [...prevFriends]); // assuming everytime state is set there is a new render with updated friend loc
      }

    })
  });


  useEffect (() => {
    socket.emit("getFriends:read", {userId})
    const handleGetFriends = (allFriendsUsers: any) => {
      console.log('Got friends from socket', allFriendsUsers)
      setFriends(allFriendsUsers)
    };

    socket.on("getFriends:send", handleGetFriends)

    return () => {
      socket.off("getFriends:send", handleGetFriends)
    };

}, [setUserLocation]);

  //this sets the map touch coordinates to the url as params and shows createPin modal
  const dropPin = (e: any) => {
    if (isPinSelected === false && isFriendSelected === false){
      setShowModal(true)
    }
    setSearchParams({lng:`${e.lngLat.lng.toString().slice(0,10)}` , lat:`${e.lngLat.lat.toString().slice(0,9)}`})
  }

  //finds clicked marker/pin from database
  const clickedMarker = async (e: any) => {
    const currMarkerLng = e._lngLat.lng || e.lngLat.lng 
    const currMarkerLat = e._lngLat.lat || e.lngLat.lat;

    const  lngRounded = currMarkerLng.toString().slice(0,10)
    const  latRounded = currMarkerLat.toString().slice(0,9)
    setClickedPinCoords([lngRounded, latRounded])

    try {
      const { data } = await axios.get(`/api/pins/get-clicked-pin-marker/${lngRounded}/${latRounded}`)
          setSelectedPin(data);
          setIsPinSelected(true);
          setShowDirections(true);
          setIsFriendSelected(false)

      } catch (err)  {
        try {
          const { data } = await axios.get(`/api/pins/get-clicked-friend-marker/${lngRounded}/${latRounded}`)
          setSelectedPin(data);
          setShowFriendPopup(true)
          setShowDirections(true)
          setIsFriendSelected(true)
          setShowModal(false)
        } catch (err)  {
          console.error(err);
        }
      }
  };

  // when pin is selected, route and modal are triggered
  useEffect(() => {
    createRouterLine(selectedRouteProfile)
    modalTrigger()
  }, [isPinSelected])

  // when friend is selected, route is called and friend state is reset
  useEffect(() => {
    createRouterLine(selectedRouteProfile)
    setRouteDirections(true)
    if(isFriendSelected === true){
      setIsFriendSelected(false)
    }
  }, [isFriendSelected])

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
    return routerFeature
  }

 // handles the route line creation by making the response from the directions API into a geoJSON
 // which is the only way to use it in the <Source> tag (displays the "route/line")
  const createRouterLine = async (routeProfile: string,): Promise<void> => {
    //console.log(isPinSelected, isFriendSelected)
    // if (isPinSelected === true || isFriendSelected === true){
      const startCoords = `${userLocation[0]},${userLocation[1]}`
      const endCoords = `${clickedPinCoords[0]},${clickedPinCoords[1]}`
      const geometries = 'geojson'
      const url = `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw`;

      try {
        const { data } = await axios.get(url);

        data.routes.map((route: any) => {
          setDistance((route.distance / 1609).toFixed(2)) // meters to miles
          setDuration((route.duration).toFixed(2)) // hours
        });

        const coordinates = data['routes'][0]['geometry']['coordinates']
        const destinationCoordinates = data['routes'][0]['geometry']['coordinates'].slice(-1)[0]
        setDestinationCoords(destinationCoordinates)

        if (coordinates.length) {
          const routerFeature = makeRouterFeature([...coordinates])
          setRouteDirections(routerFeature)
          setShowRouteDirections(true);
        }
      } catch (err) {
        console.error(err);
      }
    // }
  }

  //prompts the modal to open/close on pin vs map(empty) click
  const modalTrigger = () => {
    if (isPinSelected === false){
      setShowModal(false)
    } else {
     setShowModal(true)
    }
  }

  // converts meters to miles and seconds to hours and minutes
  const humanizedDuration = (duration: number) => {
    duration = Number(duration);
    const h = Math.floor(duration / 3600);
    const m = Math.floor(duration % 3600 / 60);

    const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes") : "";

    return `${hDisplay + mDisplay}`;
}

 // sets pin category color when the pins load on the map
  const pinCategoryColor = (marker: any) => {
    const colorMapping: PinColorMapping = {
      isFree:"#53CA3C",
      isToilet: "#169873",
      isFood: "#FCC54E",
      isPersonal: "#BA37DD",
      isPhoneCharger: '#53e3d4',
      isPoliceStation: "#E7ABFF",
      isEMTStation:"#f27d52"
    }

    for(const key in marker){
      if (marker[key] === true){
        return colorMapping[key]
      }
    }
  }

  // styles the filter buttons
  const filterStyling = (value: string) => {
    const colorMapping: PinColorMapping = {
      isFree:"#53CA3C",
      isToilet: "#169873",
      isFood: "#FCC54E",
      isPersonal: "#BA37DD",
      isPhoneCharger: '#53e3d4',
      isPoliceStation: "#E7ABFF",
      isEMTStation:"#f27d52"
    }

    const off = {
      backgroundColor: `${colorMapping[value]}`,
      color: "black"
    }

    const on = {
      backgroundColor: "white",
      color: `${colorMapping[value]}`,
      borderColor: `${colorMapping[value]}`,
      borderWidth: "3px",
      borderStyle: "solid",
      fontWeight: "bold"
    }

    if (value === filterChoice && filterOn === true){
      return on
    } else {
      return off
    }    
  }

  // manages the rendering for the filter element
  const filterResults = (e: string) => {
    setFilterOn(false)
    const choice = e;
    
    const filteredPins = markers.filter((marker) => {
      for(const key in marker){
       if (marker[choice] === true){
        return marker
       }
      }
    })

    setFilterOn(true)
    setFilterChoice(choice)
    setFilteredMarkers(filteredPins)
  }

  return (
    <Container className="body">
      <span>Click on the Map to add a Pin or on a Pin to see the details</span>
      { showModal ?
        <PinModal
          userId={userId}
          setShowModal={setShowModal}
          markers={markers}
          setMarkers={setMarkers}
          isPinSelected={isPinSelected}
          selectedPin={selectedPin}
          setIsPinSelected={setIsPinSelected}
        />
        : null }
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onClick={(e) => {dropPin(e)}}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', bottom: '0px', maxWidth: '100vw', height: "50vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          showUserLocation={true}
          showAccuracyCircle={false}
          ref={geoControlRef}
        />
      <div id='map-markers'>
        {
          renderMarkers.map((marker) => (
            <Marker
            key={marker.id}
            onClick={(e) => {clickedMarker(e.target)}}
            longitude={marker.longitude} latitude={marker.latitude}
            anchor="bottom"
            color={pinCategoryColor(marker)}>
            </Marker>
          ))
        }
      </div>
      <div id='friend-markers'>
        {
          friends.map((friend) => (
            <Marker
            key={friend.id}
            onClick={(e) => {clickedMarker(e.target)}}
            longitude={friend.longitude} latitude={friend.latitude}
            anchor="center"
            >
              <img src="img/friend_dot.png" width="30px" height="30px"/>
            </Marker>
          ))
        }
      </div>
      <div id='event-markers'>
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
      </div>
      {showRouteDirections ? (
          <Source id="line1" type="geojson" data={routeDirections}>
            <Layer
              id="routerLine01"
              type="line"
              paint={{
                'line-color': '#BA37DD',
                'line-width': 3,
              }}
            />
          </Source>
        ): null}
      <NavigationControl />
      {showFriendPopup ? (
          <>
            {friends.map((friend) => (
              <Popup
                key={friend.id}
                longitude={friend.longitude} latitude={friend.latitude}
                anchor="bottom"
                closeOnMove={true}
                onClose={() => setShowFriendPopup(false)}
              >
                <b>{friend.firstName[0]}{friend.lastName[0]}</b>
              </Popup>
            ))}
          </>
        ) : null}
        { showDirections ? (
          <div id="map-direction-card" className='card w-35'>
            <div className= 'card-body'>
              <p style={{fontSize: "15px"}}><b>{humanizedDuration(duration)}</b> away</p>
              <p style={{fontSize: "15px"}}> <b>{distance}</b> miles</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => {setShowDirections(false); setShowRouteDirections(false)}}>Close</button>
            </div>
          </div> 
        ) : null}
      </Map>
      <div id="map-filter-container" className="container">
        <span>FILTER PINS</span>
          <center id='map-filter-buttons'>
            <div className="btn-group" role="group" aria-label="Basic example"> 
              <button type="button" style={filterStyling("isFree")} value="isFree"  className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Free Toilets</button>
              <button type="button" style={filterStyling("isToilet")} value="isToilet" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Pay for Toilet</button>
              <button type="button" style={filterStyling("isFood")} value="isFood" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Food</button>
              <button type="button" style={filterStyling("isPersonal")} value="isPersonal" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Personal</button>
            </div>
            <div className="btn-group" role="group" aria-label="Basic example"> 
              <button type="button" style={filterStyling("isPhoneCharger")} value="isPhoneCharger" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Phone Charger</button>
              <button type="button" style={filterStyling("isPoliceStation")} value="isPoliceStation" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Police Station</button>
              <button type="button" style={filterStyling("isEMTStation")} value="isEMTStation" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>EMT Station</button><br />
            </div><br /> 
            <button type="button" value="clearFilters" className="btn btn-wide" onClick={()=> {setFilterOn(false); filterStyling(filterChoice)}}>Clear Filter</button>
          </center><br />
      </div>
   </Container>
  )
}

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

// gets friends from database? probably unnecessary with the getFriends axios call
//   useEffect (() => {
//     socket.emit("getFriends:read", {userId})
//     const handleGetFriends = (allFriendsUsers: any) => {
//       console.log('Got friends from socket', allFriendsUsers)
//       setFriends(allFriendsUsers)
//     };

//     socket.on("getFriends:send", handleGetFriends)

//     return () => {
//       socket.off("getFriends:send", handleGetFriends)
//     };

// }, [setUserLocation]);