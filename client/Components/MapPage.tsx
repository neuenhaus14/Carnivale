/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl';
import PointAnnotation from 'react-map-gl'
import { BsFillPinFill } from "react-icons/bs";
import { useSearchParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import {AddressAutofill, SearchBox} from '@mapbox/search-js-react'
import 'mapbox-gl/dist/mapbox-gl.css';
import PinModal from './PinModal';

//https://blog.logrocket.com/using-mapbox-gl-js-react/#locating-your-position-react-map-gl

interface MapProps {
  userLat: number
  userLng: number
}

const MapPage: React.FC<MapProps> = ({userLat, userLng}) => {
  const mapRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [createPin, setCreatePin] = useState(false);
  const [isPinSelected, setIsPinSelected] = useState(false)
  const [selectedPin, setSelectedPin] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [markers, setMarkers] = useState([]);
  const [searchValue, setSearchValue] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number]>([userLng, userLat]);
  const [clickedPinCoords, setClickedPinCoords] = useState<[number, number]>([0, 0]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([0, 0]);
  const [routeDirections, setRouteDirections] = useState<any | null>(null);

  // console.log('userLocation', userLocation)

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
  }, [setMarkers]);

  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();
  useEffect(() => {
    geoControlRef.current?.trigger();
    console.log('geocontrolRef', geoControlRef)
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

  //this sets the map touch coordinates to the url as params
  const dropPin = (e: any) => {
    modalTrigger()
    setSearchParams({lng:`${e.lngLat.lng.toString().slice(0,10)}` , lat:`${e.lngLat.lat.toString().slice(0,9)}`})  
  }

  //finds clicked marker/pin from database
  const clickedMarker = async (e: any) => {
    const currMarkerLng = e._lngLat.lng;
    const currMarkerLat = e._lngLat.lat;

    const  lngRounded = currMarkerLng.toString().slice(0,10)
    const  latRounded = currMarkerLat.toString().slice(0,9)

    try {
      const { data } = await axios.get(`/api/pins/get-clicked-marker/${lngRounded}/${latRounded}`)
      console.log('resposne data', data[0].longitude, data[0].latitude)
      console.log('clickedMarkerRes', data);
      setSelectedPin(data);
      setIsPinSelected(true);
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
    return routerFeature;
  }

 // handles the route line creation by making the response from the directions API into a geoJSON 
 // which is the only way to use it in the <Source> tag (displays the "route/line")
  const createRouterLine = async ( routeProfile: string ): Promise<void> => {
    console.log('userCoords', userLng, userLat)
    const startCoords = `${userLng},${userLat}`;
    const endCoords = `${clickedPinCoords[0]},${clickedPinCoords[1]}`;
    const geometries = 'geojson';
    const url = `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw`;

    try {
      const { data } = await axios.get(url);

      const result = data.routes.map((route: any) => {
        setDistance((route.distance / 1000).toFixed(2))
        setDuration((route.duration / 3600).toFixed(2))
      });

      const coordinates = data['routes'][0]['geometry']['coordinates']
      const destinationCoordinates = data['routes'][0]['geometry']['coordinates'].slice(-1)[0]
      setDestinationCoords(destinationCoordinates)

      if (coordinates.length) {
        const routerFeature = makeRouterFeature([...coordinates]);
        setRouteDirections(routerFeature);
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

  return (
    <div>
      <h1>MapPage!</h1>
      { showModal ? 
        <PinModal 
          setShowModal={setShowModal}
          markers={markers}
          setMarkers={setMarkers}
          isPinSelected={isPinSelected}
          selectedPin={selectedPin}
          // setSelectedPin={setSelectedPin}
          setIsPinSelected={setIsPinSelected} 
        /> 
        : null }
      <div id='map-page-filter' >
      </div>
      {/* <SearchBox accessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        value={searchValue}
        onChange={(e) => setSearchValue(e)}
        placeholder="Search for Location"
        marker={true}
       
      /> */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onClick={(e) => {dropPin(e); createRouterLine(selectedRouteProfile)}}
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
              anchor="bottom"> 
              {/* <BsFillPinFill style={{ width: 50, height: 25}} />  */}
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
    </div>
  )
}

export default MapPage;
