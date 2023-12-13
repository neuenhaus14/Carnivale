import React, { useEffect, useRef, useState, useContext } from 'react';
import { Map, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// This map displays in the Create Modal for either 
// creating a new event or editing an existing event that
// is owned by the user. You must own the 
// event to edit it.

interface EventCreateMapComponentProps {
  latitude: number,
  longitude: number,
}

const EventCreateMapComponent: React.FC<EventCreateMapComponentProps>= ({ latitude, longitude }) => {

  const markerClicked = () => {
    window.alert('the marker was clicked');
  };

  const mapRef = useRef(null);

  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom: 12,
  });

  return (
    <div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', width: '100%', height: '25vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker onClick={() => markerClicked()} longitude={longitude} latitude={latitude} anchor="bottom"> 
        </Marker>
        <NavigationControl />
      </Map>
    </div>
  )
}

export default EventCreateMapComponent;