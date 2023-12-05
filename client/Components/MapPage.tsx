import React, { useEffect } from 'react';
import MapPageMap from './MapPageMap'
import axios from 'axios';

const MapPage = () => {

  // const getPins = () => {
  //   axios.get('/pins/get-pins')
  //   .then((response) => {
  //     console.log(response.data)
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })
  // }


  // useEffect({
  //   axios.get('/pins/get-pins')
  //   .then((response) => {
  //     console.log(response.data)
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })
  // })


  return (
    <div>
      <h1>MapPage!</h1>
      <MapPageMap />
      
    </div>
  )

};

export default MapPage;