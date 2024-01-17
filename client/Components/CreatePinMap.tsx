import React, {useEffect, useRef, useState} from 'react';
// import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import {
  Map,
  Marker,
  NavigationControl,
  GeolocateControl,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Props {
  userLocation: [number, number]
}

const CreatePinMap: React.FC<Props> = ( {userLocation} ) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [droppedPin, setDroppedPin] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [viewState, setViewState] = useState({
    longitude: userLocation[0],
    latitude: userLocation[1],
    zoom: 18,
  });

  const mapRef = useRef(null);

  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();
  useEffect(() => {
    geoControlRef.current?.trigger();
  }, [geoControlRef.current]);


  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const { lng, lat } = params; // string


  //this sets the map touch coordinates to the url as params
  const dropPin = (e: any) => {
    setSearchParams({lng:`${e.lngLat.lng.toString().slice(0,10)}` , lat:`${e.lngLat.lat.toString().slice(0,9)}`})
    setDroppedPin(true)
  }

  return (
    <div>
     <Map
        ref={mapRef}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onClick={(e) => {dropPin(e)}}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', bottom: '0px', maxWidth: '100vw', height: "25vh" }}
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
        { droppedPin ? <Marker longitude={parseFloat(lng)} latitude={parseFloat(lat)} anchor="bottom"></Marker> : null}
        <NavigationControl/>
      </Map>
    </div>
  )
}

export default CreatePinMap;