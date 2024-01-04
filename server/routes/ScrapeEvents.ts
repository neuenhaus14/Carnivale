import express, {Router, Request, Response } from 'express';
import axios from 'axios'
import fs from 'fs/promises'
import {Event} from '../db';
import cheerio from "cheerio";
import dayjs from 'dayjs';


const Gigs = express.Router()
//new Date makes todays date
//LOOK INTO PROMISESALL
//const userDate = new Date().toISOString().slice(0, 10)

//TODO: add  UI drop down for date requests. If already scraped, return the scraped dates. If not, scrape and add to db

//const userDate = ""
//setInterval(start(userDate), 1000*60*60*24)
//const job = schedule.scheduleJob('10 12 * * 1-7', function(start(userDate)));
//making an async function for cheerio scraping
async function start(userDate: string) {
//string interpolation for the UI date request (YYYY-MM-DD)
  const url = `https://www.wwoz.org/calendar/livewire-music?date=${userDate}`
  //const url = `https://www.wwoz.org/calendar/livewire-music?date=2024-01-02`
  //console.log(userDate)
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
    proper.push(dayjs(`${date[i]} 2023 ${time[i]}`).format('YYYY-MM-DDTHH:mm'))
  }
  console.log('proper', proper[0])
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
      // longitude: null,
      // latitude: null,
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
  return {
    // venueTagContent,
    // info,
    mainArr
  }
} catch (error) {
  throw new Error(
    `Error scraping parade info for ${error}`
  );
// } finally {
//   const addresses = [];
// Event.findOne({where: {lat : null}}) //get back array of objects
// .then((coordinates) => {
// //take the address, put it through converter, put to db the coords
// console.log('address from psql', coordinates.address)
// // const convert = address
// const { data } = await axios.post('/api/events/getCoordinatesFromAddress', {address:`Blue Nile New Orleans La`})
// // convert.update({latitude: data[0], longitude: data[1]}, {where: {}})

// })
// .catch((err) => {
//   console.error("Failed to convert to coords for db", err)
// })


//   const coords = []

// //   const { data } = await axios.post('/api/gigs/events/getCoordinatesFromAddress', {address:`${location[0]} New Orleans La`})
// //   const coor = data
// //   console.log('Address Success', coor)
// //   coords.push(coor)

// // console.log('coords', coords[0])
// // console.log(location[0])
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
//start(userDate)
  // Gigs.post('/events/getCoordinatesFromAddress', async( req: Request, res: Response) => {
  //   const {address} = req.body
  //   try {
  //     res.send(address)
  //     console.log('address success', res.json())
  //   } catch (error) {
  //     console.error(error.message)
  //     res.status(500).json({ error: "Get coords problem" });
  //   }
  // });
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
