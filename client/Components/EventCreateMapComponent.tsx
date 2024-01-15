import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, NavigationControl, GeolocateControl, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
// This map displays in the Create Modal for either
// creating a new event or editing an existing event that
// is owned by the user. You must own the
// event to edit it.

interface EventCreateMapComponentProps {
  eventLatitude: number,
  eventLongitude: number,
  isNewEvent: boolean,
  userLatitude: number,
  userLongitude: number,
  setEventLongitude: any,
  setEventLatitude: any,
  setEventAddress: any,
  setIsEventUpdated: any,
  eventType: string,
  selectedEvent: any,
  userId: number,
}

const EventCreateMapComponent: React.FC<EventCreateMapComponentProps> = ({ isNewEvent, eventLatitude, eventLongitude, userLatitude, userLongitude, setEventLatitude, setEventLongitude, setEventAddress, setIsEventUpdated, eventType, selectedEvent, userId }) => {

  const markerClicked = () => {
    window.alert('the marker was clicked');
  };

  const mapRef = useRef(null);

  // in tandem, these load the userLoc marker immediately
  const geoControlRef = useRef<mapboxgl.GeolocateControl>();

  // these useEffects determines where/when the map zooms

  // center map over user on first load
  // useEffect(() => {
  //   setTimeout(()=>{
  //            geoControlRef.current?.trigger();
  //          }, 200)
  // }, [geoControlRef.current])

  const nolaLong = -90.06285;
  const nolaLat = 29.95742;

  const delayedFlyTo = (longitude: any, latitude: any) => {
    setTimeout(() => {
      mapRef.current?.flyTo({ center: [longitude, latitude] })
    }, 400)
  }

  // MAP FLY TO FUNCTIONALITY, DEPENDS ON EVENT TYPE AND OTHER PROPS
  useEffect(() => {
    // brand new event, zooms to user location.
    // For new user event, eventLat gets set to userLat and is passed into map
    // so w
    if (isNewEvent === true && !selectedEvent.ownerId && eventType === 'user' && eventLatitude === userLatitude) {
      delayedFlyTo(userLongitude, userLatitude);
    }

    // updated pin for new event creation. user and event latitudes differ
    // moving the pin resets eventLatitude and eventLongitude on user page
    else if (isNewEvent === true && !selectedEvent.ownerId && eventType === 'user' && eventLatitude !== userLatitude) {
      delayedFlyTo(eventLongitude, eventLatitude);
    }

    // old event owned by user id (won't get triggered for events invited to)
    else if (isNewEvent === false && selectedEvent.ownerId === userId && eventType === 'user') {
      delayedFlyTo(eventLongitude, eventLatitude);
    }
    // gig event
    else if (isNewEvent === true && eventType === 'gig') {
      delayedFlyTo(eventLongitude, eventLatitude)
    }

    // parade event
    else if (isNewEvent === true && eventType === 'parade') {
      delayedFlyTo(eventLongitude, eventLatitude)
    }
  }, [eventLatitude, eventLongitude, userLongitude, userLatitude, isNewEvent])


  const [viewState, setViewState] = useState({
    // lat and long default to zero, so new events will not have lat/long
    latitude: eventLatitude > 0 ? eventLatitude : userLatitude,
    longitude: eventLongitude > 0 ? eventLongitude : userLongitude,
    zoom: 12,
  });


  const dropPin = async (e: any) => {
    const { lat, lng } = e.lngLat
    setEventLatitude(lat);
    setEventLongitude(lng);

    const eventAddressResponse = await axios.post('/api/events/getAddressFromCoordinates', {
      coordinates : {
        latitude: lat,
        longitude: lng
      }
    });
    const eventAddress = eventAddressResponse.data;
    setIsEventUpdated(true);
    setEventAddress(eventAddress)
  }

  return (
    <div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'relative', width: '100%', height: '25vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={dropPin}
      >

        { // conditional render for pin if we're editing the event
        // or have placed an address
        (eventLatitude !== 0 && eventLongitude !== 0) &&
        <Marker onClick={() => markerClicked()} longitude={eventLongitude} latitude={eventLatitude} anchor="bottom"></Marker>
        }

        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          showUserLocation={true}
          showAccuracyCircle={false}
          ref={geoControlRef}
          />

        <NavigationControl/>
      </Map>
    </div>
  )
}

export default EventCreateMapComponent;