/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useContext } from "react";
import { Map, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import { BsFillPinFill } from "react-icons/bs";
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CreatePin from './CreatePin';

// type DroppedPin = {
//     lng: number,
//     lat: number,
// }

const MapPageMap = () => {
  const [createPin, setCreatePin] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [droppedPin, setDroppedPin] = useState({
    lng: null,
    lat: null
  })
  const [viewState, setViewState] = useState({
    latitude: 29.964735,
    longitude: -90.054261,
    zoom: 14,
  });

  const navigate = useNavigate();

  //loads pins immediately on page render, once
  useEffect(() => {
    getPins();
  }, []);

  const getPins = async () => {
    try {
      const response = await axios.get('/api/pins/get-pins')
      setMarkers(response.data)
    } catch (err)  {
      console.error(err)
    }
  }

  const dropPin = (e: any) => {
    console.log(e.lngLat.lng, e.lngLat.lat)
    setDroppedPin({
      lng: e.lngLat.lng,
      lat: e.lngLat.lat})
    //handlePinNavigation()
    createPinState()
  }

  const createPinState = () => {
    setCreatePin(!createPin)
  }

  // const handlePinNavigation = () => {
  //   //navigate(`/createpin/${droppedPin.lng}/${droppedPin.lat}`)
  //   <Link to={`/mappage/createpin/${droppedPin.lng}/${droppedPin.lat}`} />
  //   setDroppedPin({
  //     lng: null,
  //     lat: null
  //   });
    
  // };

  useEffect(() => {
    <Link to={`/mappage/createpin/${droppedPin.lng}/${droppedPin.lat}`} />
    // if (droppedPin.lng !== null && droppedPin.lat !== null) {
    //   navigate(`createpin/${droppedPin.lng}/${droppedPin.lat}`)
    //     setDroppedPin({
    //       lng: null,
    //       lat: null
    //     });
    // }
  }, [droppedPin]);


  const clickedMarker = (e: any) => {
    const currMarkerLng = e._lngLat.lng;
    const currMarkerLat = e._lngLat.lat;

    console.log(e._lngLat.lng, e._lngLat.lat);

  };

  const mapRef = useRef(null);

  return (
    <div>
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
            onClick={(e) => clickedMarker(e.target)} 
            longitude={marker.longitude} latitude={marker.latitude}
            anchor="bottom"> 
            <BsFillPinFill style={{ width: 25, height: 50}} /> 
            </Marker>
          ))
        }
      </div>
      <NavigationControl />
      </Map>
      { createPin? <CreatePin change={createPinState}/> : null }
    </div>
  )
}

export default MapPageMap;
