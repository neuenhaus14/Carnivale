/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl';
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
}

const MapPage: React.FC<MapProps> = ({userLat, userLng, userId}) => {
  const mapRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [createPin, setCreatePin] = useState(false)
  const [isPinSelected, setIsPinSelected] = useState(false)
  const [selectedPin, setSelectedPin] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([userLng, userLat]);
  const [clickedPinCoords, setClickedPinCoords] = useState<[number, number]>([0, 0]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([0, 0]);
  const [routeDirections, setRouteDirections] = useState<any | null>(null);
  const [friends, setFriends] = useState([])
  const [events, setEvents] = useState([])
  const [showDirections, setShowDirections]= useState(false);
  const [viewState, setViewState] = useState({
    latitude: 29.964735,
    longitude: -90.054261,
    zoom: 16,
  });

  const routeProfiles = [
    {id: 'walking', label: 'Walking', icon: 'walking'},
    {id: 'cycling', label: 'Cylcing', icon: 'bicycle'},
    {id: 'driving', label: 'Driving', icon: 'car'},
  ];
  const [selectedRouteProfile, setselectedRouteProfile] = useState<string>('walking');

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
    modalTrigger()
    setSearchParams({lng:`${e.lngLat.lng.toString().slice(0,10)}` , lat:`${e.lngLat.lat.toString().slice(0,9)}`})  
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
      const { data } = await axios.get(`/api/pins/get-clicked-marker/${lngRounded}/${latRounded}`)
      console.log('resposne data', data[0].longitude, data[0].latitude)
      console.log('clickedMarkerRes', data);
      setSelectedPin(data);
      setIsPinSelected(true);
      setShowDirections(true);
      modalTrigger()
    } catch (err)  {
      console.error(err);
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

      const result = data.routes.map((route: any) => {
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
  
  const humanizedDuration = (duration: number) => {
    duration = Number(duration);
    const h = Math.floor(duration / 3600);
    const m = Math.floor(duration % 3600 / 60);
    const s = Math.floor(duration % 3600 % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    return `Time to Pin: ${hDisplay + mDisplay}`; 

}


  const pinCategoryColor = (marker: any) => {
    const colorMapping: PinColorMapping = {
      isFree:"#90a8c9",
      isToilet: "#21675e",
      isFood: "#cd8282",
      isPersonal: "#82a8dc",
      isPhoneCharger: '#53e3d4',
      isPoliceStation: "#82cda8",
      isEMTStation:"#f27d52"
    }

    for(const key in marker){
      if (marker[key] === true){
        return colorMapping[key]
      }
    }
  }

  return (
    <div>
      <h1>MapPage!</h1>
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
        style={{ position: 'relative', bottom: '0px', width: '100vw', height: 475 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          showAccuracyCircle={false}
          ref={geoControlRef}       
          />
      <div id='map-markers'>
        {
          markers.map((marker) => (
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
            color="#aa9ce3"> 
            
            {/* <b>{friend.firstName[0]}{friend.lastName[0]}</b> */}
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
                'line-color': '#FA9E14',
                'line-width': 4,
              }}
            />
          </Source>
        )}
      <NavigationControl />
      </Map>
      <div>
        {showDirections ? (
        <div>
          <p><b>{humanizedDuration(duration)} </b></p>
          <p><b> Distance to Pin: {distance} miles</b></p>
        </div>
        ) 
        : null }      
      </div>
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
