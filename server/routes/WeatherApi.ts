import { Router, Request, Response } from 'express';
import axios from 'axios';
import { WEATHER_API_KEY } from '../config';

const WeatherRoutes = Router();

WeatherRoutes.get('/:location', async (req: Request, res: Response) => {
  const { location } = req.params;
  try {
    const { data } = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no&alerts=no`
    );
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default WeatherRoutes;
