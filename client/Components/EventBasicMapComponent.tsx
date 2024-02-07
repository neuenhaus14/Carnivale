import React, { useRef, useState } from 'react';
import {
  Map,
  Marker,
  NavigationControl,
  GeolocateControl,

} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface EventBasicMapComponentProps {
  longitude: number;
  latitude: number;
}

// This map component is for displaying a pin,
// it does not have functionality for moving the pin, or
// setting the location

const EventBasicMapComponent: React.FC<EventBasicMapComponentProps> = ({
  latitude,
  longitude,
}) => {
  const markerClicked = () => {
    window.alert('the marker was clicked');
  };

  const mapRef = useRef(null);

  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();


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
        mapboxAccessToken='pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw'
        style={{ position: 'relative', width: '100%', height: '25vh' }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
      >
        <Marker
          onClick={() => markerClicked()}
          longitude={longitude}
          latitude={latitude}
          anchor='bottom'
        ></Marker>
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          // prevents zooming directly to user loc
          // map center stays on selectedEvent
          trackUserLocation={true}
          showUserHeading={true}
          showUserLocation={true}
          showAccuracyCircle={false}
          ref={geoControlRef}
        />
        <NavigationControl/>
      </Map>
    </div>
  );
};

export default EventBasicMapComponent;
