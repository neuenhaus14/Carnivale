import React, { useEffect, useRef, useState, useContext } from "react";
import { Map, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import { BsFillPinFill } from "react-icons/bs";
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapPageMap = () => {
  
  const [markers, setMarkers] = useState([])
  const [viewState, setViewState] = useState({
    latitude: 29.9275524,
    longitude: -90.1137725,
    zoom: 13.5,
  });


  const markerClicked = () => {
    window.alert('the marker was clicked');
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
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', bottom: '0px', width: '100vw', height: 475 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker onClick={() => markerClicked()} longitude={-90.1162186} latitude={29.9222337} anchor="bottom"> <BsFillPinFill style={{ width: 25, height: 50}} /> </Marker>
        <Marker onClick={() => markerClicked()} longitude={-90.1201669} latitude={29.9262878} anchor="bottom"> <BsFillPinFill style={{ width: 25, height: 50}} /> </Marker>
        <NavigationControl />

      </Map>
    </div>
  )
}

export default MapPageMap;
