import React, { useEffect, useRef, useState, useContext } from "react";
import { Map, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import { Outlet, Link } from 'react-router-dom';
import { BsFillPinFill } from "react-icons/bs";
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapPageMap = () => {
  const [showOutlet, setShowOutlet] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [viewState, setViewState] = useState({
    latitude: 29.964735,
    longitude: -90.054261,
    zoom: 12,
  });
  const [newPin, setNewPin] = useState({
    longitude: null,
    latitude: null,
    isToilet: false,
    isFood: false,
    isPersonal: false,
    isFree: true,
    ownerId: null,
  });

  //loads pins immediately on page render, once
  useEffect(() => {
    getPins();
  }, []);

  const getPins = () => {
    axios.get('/api/pins/get-pins')
    .then((response) => {
      setMarkers(response.data)
    })
    .catch((err) => {
      console.error(err)
    })
  }

  const addPins = () => {

    // set state and need all the details from a form????

    axios.post('/api/pins/post-pins', {
      options: {
        newPin
      }
    })
    .then((response) => {
      console.log(response)
    })
    .catch((err) => {
      console.error(err)
    })
  }


  const clickedMarker = (e) => {
    const currMarkerLng = e._lngLat.lng;
    const currMarkerLat = e._lngLat.lat;
    let clickedPin;

    console.log(e._lngLat.lng, e._lngLat.lat);
  
    // create axios request and do this logic server side??? 
    // send the details as params to get the clicked Pin

    // for (let i = 0; i < markers.length; i++){
    //   if (markers[i].longitude === currMarkerLng){
    //     console.log(markers[i])
    //     clickedPin = markers[i]
    //     return clickedPin
    //   }
    // }

    // console.log(clickedPin)
  };

  const mapRef = useRef(null);
  
  const buttonClick = () => {
    setShowOutlet(true);
  };

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
      <div id='map-markers'>
        {
          markers.map((marker) => (
            <Marker 
            key={marker.id}
            // onClick={(e) => markerClicked(e.target._map._markers[marker.id])} 
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
      <div id='create-pin'>
        <p>Add a Pin Below!</p>
        <div id="create-pin-buttons">
          <Link to='/createpin'>
            <button type="button" onClick={buttonClick}>Add Free Toilet</button>
            <button type="button" onClick={buttonClick}>Add Toilet</button>
            <button type="button" onClick={buttonClick}>Add Food</button>
            <button type="button" onClick={buttonClick}>Add Custom</button>
          </Link>
          
        </div>
      </div>
    </div>
  )
}

export default MapPageMap;
