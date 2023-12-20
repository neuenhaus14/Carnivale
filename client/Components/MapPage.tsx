/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl, GeolocateControl, Source, Layer, Popup } from 'react-map-gl';
import { Card, Button, Accordion } from 'react-bootstrap'
import PointAnnotation from 'react-map-gl'
import { useSearchParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PinModal from './PinModal';


interface MapProps {
  userLat: number
  userLng: number
  userId: number
  getLocation: any
}

const MapPage: React.FC<MapProps> = ({userLat, userLng, userId, getLocation}) => {
  const mapRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [createPin, setCreatePin] = useState<boolean>(false)
  const [isPinSelected, setIsPinSelected] = useState<boolean>(false)
  const [selectedPin, setSelectedPin] = useState({})
  const [showModal, setShowModal] = useState<boolean>(false)
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([])
  const [filterOn, setFilterOn] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState<[number, number]>([userLng, userLat]);
  const [clickedPinCoords, setClickedPinCoords] = useState<[number, number]>([0, 0]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([0, 0]);
  const [routeDirections, setRouteDirections] = useState<any | null>(null);
  const [friends, setFriends] = useState([])
  const [events, setEvents] = useState([])
  const [showDirections, setShowDirections]= useState<boolean>(false);
  const [showFriendPopup, setShowFriendPopup] = useState<boolean>(true);
  const [viewState, setViewState] = useState({
    latitude: 29.964735,
    longitude: -90.054261,
    zoom: 16,
  });

  const routeProfiles = [
    {id: 'walking', label: 'Walking'},
    {id: 'cycling', label: 'Cylcing'},
    {id: 'driving', label: 'Driving'},
  ];
  const [selectedRouteProfile, setselectedRouteProfile] = useState<string>('walking');

  const renderMarkers = filterOn ? filteredMarkers : markers

  //loads pins immediately on page render
  useEffect(() => {
    getPins();
    getFriends();
    getEvents();
    console.log('userId', userId)
  }, [setMarkers]);

  
  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();
  useEffect(() => {
    geoControlRef.current?.trigger();
    getLocation();
  }, [geoControlRef.current]);


  //gets pins from database
  const getPins = async () => {
    try {
      const response = await axios.get('/api/pins/get-pins')
      setMarkers(response.data)
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

  // gets friends from the database
  const getFriends = async () => {
    try {
      const friends = await axios.get(`/api/friends/getFriends/${userId}`)
      setFriends(friends.data)
    } catch (err)  {
      console.error(err)
    }
  }

  //this sets the map touch coordinates to the url as params
  const dropPin = (e: any) => {

    setTimeout (() => {
      modalTrigger()
    }, 250)
   // modalTrigger()
    setSearchParams({lng:`${e.lngLat.lng.toString().slice(0,10)}` , lat:`${e.lngLat.lat.toString().slice(0,9)}`})  
  }

  //finds clicked marker/pin from database
  const clickedMarker = async (e: any) => {
    const currMarkerLng = e._lngLat.lng;
    const currMarkerLat = e._lngLat.lat;
    
    const  lngRounded = currMarkerLng.toString().slice(0,10)
    const  latRounded = currMarkerLat.toString().slice(0,9)
    setClickedPinCoords([lngRounded, latRounded])
    

    try {
      const { data } = await axios.get(`/api/pins/get-clicked-pin-marker/${lngRounded}/${latRounded}`)
        setSelectedPin(data);
        setIsPinSelected(true);
        setShowDirections(true);
        modalTrigger()
      } catch (err)  {
        console.error(err); 
        try {
          const { data } = await axios.get(`/api/pins/get-clicked-friend-marker/${lngRounded}/${latRounded}`)
          console.log('clickedFriend', data);
          setShowModal(false)
          setShowFriendPopup(true)
          setShowDirections(true)
        } catch (err)  {
          console.error(err);
        }
      }

  };

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
  const createRouterLine = async (userLocation: [number, number], routeProfile: string,): Promise<void> => {
    console.log('userCoords', userLng, userLat)
    const startCoords = `${userLng},${userLat}`
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
      }
    } catch (err) {
      console.error(err);
    }
  }

  // prompts the modal to open/close
  const modalTrigger = () => {
    if (isPinSelected === true){
      setCreatePin(false)
      setShowModal(true)
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

  const filterResults = (e: string) => {
    const filterChoice = e;
    console.log(e)

    const filteredPins = markers.filter((marker) => {
      for(const key in marker){
       if (marker[filterChoice] === true){
        return marker
       }
      }
    })

    setFilterOn(!filterOn)
    setFilteredMarkers(filteredPins)
  }

  return (
    <div>
      <h1>Map Page!</h1>
      <Accordion>
        <Accordion.Item eventKey="0">
        <Accordion.Header>Filter Pins</Accordion.Header>  
          <Accordion.Body>
          {/* <div className= 'card'>
            <div className="card-body"> */}
            <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
              <button type="button" value="isFree" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Free Toilets</button>
              <button type="button" value="isToilet" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Pay for Toilet</button>
              <button type="button" value="isFood" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Food</button>
              <button type="button" value="isPersonal" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Personal</button>
              <button type="button" value="isPhoneCharger" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Phone Charger</button>
              <button type="button" value="isPoliceStation" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>Police Station</button>
              <button type="button" value="isEMTStation" className="btn" onClick={(e) => {filterResults(e.currentTarget.value)}}>EMT Station</button>
            </div>
            {/* </div>
          </div> */}
          </Accordion.Body>
        </Accordion.Item>
    </Accordion>
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
      <div id='map-page-filter' >
      </div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onClick={(e) => {dropPin(e); createRouterLine(userLocation, selectedRouteProfile)}}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', bottom: '0px', width: '100vw', height: "50vh" }}
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
            anchor="bottom" 
            color="white"> 
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
      {routeDirections && (
          <Source id="line1" type="geojson" data={routeDirections}>
            <Layer
              id="routerLine01"
              type="line"
              paint={{
                'line-color': '#000000',
                'line-width': 4,
              }}
            />
          </Source>
        )}
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
                <b>{friend.firstName} {friend.lastName}</b>
              </Popup>
            ))}
          </>
        ) : null} 
      <div id="map-direction-card" className='card w-35'>
        {showDirections ? (
          <div className= 'card-body'>
            <span> Time to Location: </span> <br /><span><b>{humanizedDuration(duration)}</b></span> <br />
            <span> Distance to Location:</span> <br /><span> <b>{distance} miles</b></span><br />
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowDirections(false)}>Close</button>
        </div>
        ) 
        : null }      
      </div>
      </Map>
      <center>
      <div id="map-pin-key-img">
        <h3><b>MAP KEY</b></h3>
        <img src="img/Map_pin_key.jpg" alt="Map Pin Key" width='300' height= "225"/>      
      </div>
      </center>
    </div>
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
