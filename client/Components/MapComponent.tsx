import React, { useEffect, useRef, useState, useContext } from "react";
import { Map, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = () => {
  
  const markerClicked = () => {
    window.alert('the marker was clicked');
  };

  const mapRef = useRef(null);
  
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 6,
  });
  return (
    <div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'absolute', bottom: '0px', width: '100vw', height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker onClick={() => markerClicked()} longitude={0} latitude={0} anchor="bottom"> 
        </Marker>
        <NavigationControl />

      </Map>
    </div>
  )
}

export default MapComponent;
