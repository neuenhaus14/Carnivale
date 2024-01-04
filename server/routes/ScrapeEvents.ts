import express, {Router, Request, Response } from 'express';
import axios from 'axios'
import fs from 'fs/promises'
import {Event} from '../db';
import cheerio from "cheerio";
import dayjs from 'dayjs';


const Gigs = express.Router()

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
    //let timeNum = test[1].replace(/[amp]/g, '').trim()
    //console.log(timeNum, typeof timeNum)
    time.push(test[1].replace(/[amp]/g, '').trim())
  }
  //array for proper time numbers for next for loop
  const proper = []
  for (let i = 0; i < day.length; i++) {
    proper.push(dayjs(`${date[i]} 2023 ${time[i]}`).format('YYYY-MM-DDTHH:mm'))
  }
  console.log('proper', typeof time[0])
  //finally, array to hold individual objects to be added to db
  //console.log('date', date[0], 'act', act[0], 'location', location[0], 'proper', proper[0], 'day', day[0], 'dayjs', dayjs(`${date[0]} 2023 11:45`).format('YYYY-MM-DDTHH:mm'))
//await for all the addresses in the location array, make an array of tuples [lat lng] for every address, send a reqquest for the coordis converter

  const mainArr = []
  for (let i = 0; i < day.length; i++) { //or day.length
    mainArr.push({
      name: act[i],
      startTime: proper[i],
      endTime: dayjs(`${date[i]} 2023 11:45`).format('YYYY-MM-DDTHH:mm'),
      description: act[i],
      longitude: -90,
      latitude: 30,
      address: `${location[i]} New Orleans`,
      link: url,
      system: true,
      //invitees: [], TODO:add invitees to schema
      invitedCount: 0,
      attendingCount: 0,
      // imageUrl: null,
      upvotes: 0,
      // ownerId: null
    })
  }
  //console.log(mainArr)

  return {
    // venueTagContent,
    // info,
    mainArr
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
      //console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default Gigs;

//VESTIGIAL WRITE TO DB CODE
 //conditional logic to prevent duplicates. Find or Create
  // for (let i = 0; i < mainArr.length; i++) {
  //   //const rand = Math.floor(Math.random() * mainArr.length)
  //   await Event.findOrCreate({where: mainArr[i]})
  //   .then(() => {
  //     console.log("Successfully written to Event Database")
  //   })
  //   .catch((err) => {
  //     console.error("Failed to write to event db")
  //   })
  // }