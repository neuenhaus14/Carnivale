/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl } from 'react-map-gl';
import { BsFillPinFill } from "react-icons/bs";
import { useSearchParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PinModal from './PinModal';


const MapPage = () => {
  const mapRef = useRef(null);
    // loader data brings in live data from the google oauth
    const userData = useLoaderData();
    const userId = userData
    console.log('userId', userId)

  const [searchParams, setSearchParams] = useSearchParams();
  const [createPin, setCreatePin] = useState(false);
  const [isPinSelected, setIsPinSelected] = useState(false)
  const [selectedPin, setSelectedPin] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [markers, setMarkers] = useState([]);
  const [viewState, setViewState] = useState({
    latitude: 29.964735,
    longitude: -90.054261,
    zoom: 14,
  });

  //loads pins immediately on page render
  useEffect(() => {
    getPins();
  }, [setMarkers]);

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
    setSearchParams({lng:`${e.lngLat.lng}` , lat:`${e.lngLat.lat}`})  
  }

  const clickedMarker = async (e: any) => {
    const currMarkerLng = e._lngLat.lng;
    const currMarkerLat = e._lngLat.lat;

    try {
      const { data } = await axios.get(`/api/pins/get-clicked-marker/${currMarkerLng}/${currMarkerLat}`)
      console.log('clickedMarkerRes', data);
      setSelectedPin(data);
      setIsPinSelected(true);
      modalTrigger()
    } catch (err)  {
      console.error(err);
    }

    // setIsPinSelected(true);
    // modalTrigger()
  };

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
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onClick={(e) => {dropPin(e)}}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', bottom: '0px', width: '100vw', height: 475 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
      <div id='map-markers'>
        {
          markers.map((marker) => (
            <Marker 
            key={marker.id}
            onClick={(e) => {clickedMarker(e.target)}} 
            longitude={marker.longitude} latitude={marker.latitude}
            anchor="bottom"> 
            <BsFillPinFill style={{ width: 50, height: 25}} /> 
            </Marker>
          ))
        }
      </div>
      <NavigationControl />
      </Map>
    </div>
  )
}

export default MapPage;
