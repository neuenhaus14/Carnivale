import express, {Router, Request, Response } from 'express';
import axios from 'axios'
import puppeteer from 'puppeteer';
import fs from 'fs/promises'
import {Event} from '../db'
import cheerio from "cheerio";

const Gigs = express.Router()

//TODO: add  UI drop down for date requests. If already scraped, return the scraped dates. If not, scrape and add to db
const userDate = ""

//making an async function for cheerio scraping
async function start(userDate: string) {
//string interpolation for the UI date request (YYYY-MM-DD)
  const url = `https://www.wwoz.org/calendar/livewire-music?date=${userDate}`

  try {
    const response = await axios.get(url);
    const htmlString = response.data;
    const $ = cheerio.load(htmlString); //actual scraping function
      //content I'm receiving from scaping. Pointing to the h3 container and am returning all a tags. the replace and trim are to clean up the data a little bit
    const venueTagContent = $('h3 a').text().replace(/\n /g, '').trim().split('             ')
    const info = $('.col-xs-10.calendar-info p').text().replace(/\n /g, '').trim().split('                ')
    //arrays to hold first wave of refinement
    const day = []
    const infos = []
    //arrays to hold second wave of refinement
    const location = []
    const act = []
    const date = []
    const time = []

  //looping logic to separate data since the raw is such a mess
  //first wave of refinement
  for (let i = 0; i < info.length; i++) {
    const iso = info[i].split('              ')
    infos.push(iso)
  }

  for (let i = 0; i < venueTagContent.length; i++) {
    location.push(venueTagContent[i])
  }
  //second wave of refinement
  for (let i = 0; i < infos.length; i++) {
  const iso = infos[i]
  if (i % 2 === 0) {
  act.push(iso[0])
  } else {
  day.push(iso[1].replace(/\s\s+/g, ' ').trim())
    }
  }

  for (let i = 0; i < day.length; i++) {
    const test = day[i].split(' at ')
    date.push(test[0])
    time.push(test[1].replace(/[amp]/g, '').trim())
  }
  //array for proper time numbers for next for loop
  const proper = []
  for (let i = 0; i < day.length; i++) {
    proper.push(new Date(new Date(`${date[i]} 2023 ${time[i]}:00`)))
  }
  //finally, array to hold individual objects to be added to db
  //console.log('date', date.length, 'act', act.length, 'location', location.length, 'proper', proper.length, 'day', day.length)
//   const coords = []
//   for (let i = 0; i < 1; i++) {
//     const getCoors = await axios.post(`${location[i]} New Orleans La`)
//     const coor = getCoors.data
//     console.log(coor)
//     coords.push(coor)
//       }
// console.log('coords', coords[0])
console.log(location[0])

  const mainArr = []
  for (let i = 0; i < day.length; i++) {
    mainArr.push({
      name: act[i],
      startTime: proper[i],
      endTime: new Date(`${date[i]} 2023 11:59`),
      description: act[i],
      longitude: null,
      latitude: null,
      address: location[i],
      link: url,
      system: true,
      //invitees: [], TODO:add invitees to schema
      invitedCount: 0,
      attendingCount: 0,
      imageUrl: null,
      upvotes: 0,
      ownerId: null
    })
  }
  //console.log(mainArr)
  //conditional logic to prevent duplicates. Find or Create
  for (let i = 0; i < mainArr.length; i++) {
    const rand = Math.floor(Math.random() * mainArr.length)
    Event.findOrCreate({where: mainArr[i]})
    .then(() => {
      console.log("Successfully written to Event Database")
    })
    .catch((err) => {
      console.error("Failed to write to event db", err)
    })
  }
  return {
    venueTagContent,
    info
  }
} catch (error) {
  throw new Error(
    `Error scraping parade info for ${error}`
  );
}
}
  Gigs.get("/gigs-list/:date", async (req: Request, res: Response) => {
    const {date} = req.params;
    try {
      const scrape = await start(date);
      res.json(scrape);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  Gigs.post('/events/getCoordinatesFromAddress', async( req: Request, res: Response) => {
    const {address} = req.body
    try {
      console.log('address success', res)
    } catch (error) {
      console.error(error.message)
      res.status(500).json({ error: "Get coords problem" });
    }
  });
 //next attempting to get coordinates from the location
//   let coordsArr = []
//   for (let i = 0; i < location.length; i++) {
//   await axios.post('/getCoordinatesFromAddress', async( req: Request, res: Response) => {
//     const {
//       address: location[i],
//     } = req.body.loc
//   });
// }
export default Gigs;
