import express, {Router, Request, Response } from 'express';
import axios from 'axios'
import puppeteer from 'puppeteer';
import fs from 'fs/promises'
import {Event} from '../db'

// async function start() {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//   await page.goto('https://mccno.com/events/', {
//     waitUntil: "domcontentloaded"
//   })

//   const names = await page.evaluate(() => {
//     return Array.from(document.querySelectorAll('.list-info div')).map(e => e.textContent)
//   })
async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.wwoz.org/calendar/livewire-music?date=2023-12-19')

  const venues = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3 a')).map(e => ({
      venue: e.textContent
    })
      )
  })
  // const names = await page.evaluate(() => {
  //   return Array.from(document.querySelectorAll('.truncate a')).map(e => ({
  //     name: e.textContent
  //   })
  //     )
  // })
  const info = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.col-xs-10.calendar-info p')).map(e => ({
      date: e.textContent
    })
      )
  })

  //console.log (venues, info)//pluralize
  const day = []
  const date = []
  const act = []
  const time = []
  const location = []
  
  for (let i = 0; i < info.length; i++) {
    const iso = info[i].date
    if (i % 2 === 0) {
    act.push(iso.replace(/\s\s+/g, ' ').trim())
    } else {
    day.push(iso.replace(/\s\s+/g, ' ').trim())
    }
  }
  
  for (let i = 0; i < act.length; i++) {
    const test = day[i].split(' at ')
    date.push(test[0].trim())
    time.push(parseInt(test[1].replace(/[amp]/g, '').trim()) + 12) //need to remove : and am
  }
  
  for (let i = 0; i < venues.length; i++) {
    const iso = venues[i].venue
  location.push(iso.replace(/\s\s+/g, ' ').trim())
  }
  
  const proper = []
  
  for (let i = 0; i < 5; i++) {
    proper.push(new Date(new Date(`${date[i]} 2023 ${time[i]}:00`)))
  }
  const mainArr = []
  //console.log(date)
  for (let i = 0; i < 10; i++) {
    mainArr.push({
      name: act[i], 
      startTime: proper[i], 
      endTime: new Date(`${date[i]} 2023 11:59`),   
      description: act[i], 
      longitude: null, 
      latitude: null, 
      address: location[i],  
      link: 'https://www.wwoz.org/calendar/livewire-music',  
      system: true, 
      //invitees: [],
      invitedCount: 0, 
      attendingCount: 0, 
      upvotes: 0, 
      ownerId: null 
    })
  }

  for (let i = 0; i < mainArr.length; i++) {
    Event.findOrCreate({where: mainArr[i]})
    .then(() => {
      console.log('Successfully written to Event Database')
    })
    .catch((err) => {
      console.error('Failed to write to event db', err)
    })
  }

 
  // console.log(time, proper)
  //console.log(mainArr)
  //iterate through and clean up
  //estanblish db connection in this file
  //it wouldnt double up data
  //conditional logic to prevent duplicates. Find or Create

//fs.writeFile('eventScrapeVenue.json', JSON.stringify(venues))
// fs.writeFile('eventScrapeName.json', JSON.stringify(names))
//fs.writeFile('eventScrapeDate.json', JSON.stringify(info))


  await browser.close()
}

start()



export default start;
