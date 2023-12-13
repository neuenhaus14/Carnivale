import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import axios from "axios";

const WeatherCard = () => {
  const [location, setLocation] = useState('');
  const [currWeather, setCurrWeather] = useState("");
  const [currTemp, setCurrTemp] = useState("");
  const [avgTemp, setAvgTemp] = useState("");

  useEffect(() => {
    getLocation();
  }, []);


  const getLocation = () => {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(getWeather)
    } else {
      console.log("Geolocation is not supported by this browser")
      return null
    }
  }



  const getWeather = async (pos: any) => {
    const crd = pos.coords;
    try {
      const { data } = await axios.get(`/api/weather/${crd.latitude},${crd.longitude}`);
      setCurrWeather(data.current.condition.text);
      setCurrTemp(data.current.temp_f);
      setAvgTemp(data.forecast.forecastday[0].day.avgtemp_f);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Card>
        {
        `Current Weather: ${currWeather},
        Current Temp: ${currTemp},
        Avg Temp: ${avgTemp}
        `
      }
      </Card>
    </div>
  );
};

export default WeatherCard;
