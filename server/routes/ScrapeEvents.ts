import express, {Router, Request, Response } from 'express';
import axios from 'axios'
import puppeteer from 'puppeteer';
import fs from 'fs/promises'

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
  await page.goto('https://www.wwoz.org/calendar/livewire-music?date=2023-12-18')

  const venue = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3 a')).map(e => ({
      venue: e.textContent
    })
      )
  })
  const name = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.truncate a')).map(e => ({
      name: e.textContent
    })
      )
  })
  const date = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.col-xs-10.calendar-info p')).map(e => ({
      date: e.textContent
    })
      )
  })

  console.log(name, venue, date)

fs.writeFile('eventScrapeVenue.json', JSON.stringify(venue))
fs.writeFile('eventScrapeName.json', JSON.stringify(name))
fs.writeFile('eventScrapeDate.json', JSON.stringify(date))


  await browser.close()
}

// start()



export default start;
