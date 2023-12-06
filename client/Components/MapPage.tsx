import React, { useState, useEffect } from 'react';
import MapPageMap from './MapPageMap'
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';

const MapPage = () => {
  const [showOutlet, setShowOutlet] = useState(false);
  const [newPin, setNewPin] = useState({
    longitude: null,
    latitude: null,
    isToilet: false,
    isFood: false,
    isPersonal: false,
    isFree: true,
    ownerId: null,
  });

  const buttonClick = () => {
    setShowOutlet(true);
  };

  return (
    <div>
      <h1>MapPage!</h1>
      <MapPageMap />
      <div id='create-pin'>
        <p>Add a Pin Below!</p>
        <div id="create-pin-buttons">
          <Link to='/createpin'>
            <button type="button" onClick={buttonClick}>Add Pin</button>
          </Link>
          </div>
        </div> 
    </div>
  )

};

export default MapPage;