import React, {useEffect} from 'react';
import {
  Card,
} from "react-bootstrap";
import axios from 'axios';
import  WEATHER_API_KEY  from '../../server/config'

const HomePage = () => {

  //location = lat,long
  const location = '51.52, -0.11'
  
  const getWeather = ()=> {
    axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`)
      .then((data)=>{
        console.log(data);
      })
      .catch((err) => console.error(err))
  }

  getWeather();

return (
  <div>
    <h1>HomePage!</h1>
    <Card>

    </Card>
  </div>
)

};

export default HomePage;