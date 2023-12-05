import express, { Request, Response } from 'express';
import axios from 'axios';
//const {WEATHER_API_KEY} = require('../config');
import { WEATHER_API_KEY } from '../config';

const WeatherRouter = express.Router();

WeatherRouter.get('/:location', async (req: Request, res: Response) => {
  const { location } = req.params;
  console.log(WEATHER_API_KEY)

  // axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`).then((data) => res.status(200).send(data)).catch((err) => res.sendStatus(500));
  try {
    const { data } = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no&alerts=no`);
    res.status(200)
      .send(data);
  } catch (err) {
    //console.error(err);
    res.sendStatus(500);
  }
});

export default WeatherRouter;