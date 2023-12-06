import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import axios from "axios";

const WeatherCard = () => {
  const [location, setLocation] = useState("");
  const [currWeather, setCurrWeather] = useState("");
  const [currTemp, setCurrTemp] = useState("");
  const [avgTemp, setAvgTemp] = useState("");

  const getWeather = async () => {
    try {
      const { data } = await axios.get(`/api/weather/${location}`);
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
      <Form>
        <Form.Group>
          <Form.Label>Location</Form.Label>
          <Form.Control onChange={(e) => setLocation(e.target.value)} />
          <Button
            variant="primary"
            onClick={() => getWeather()}
          >
            GET WEATHER!!!
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default WeatherCard;
