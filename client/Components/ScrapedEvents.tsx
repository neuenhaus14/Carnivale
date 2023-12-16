import React, {useState, useEffect} from 'react';
import axios from 'axios';
import  fs from 'fs'


//Users/jamesprogram/Senior/Carnivale/eventScrapeDate.json
// declare module "*.json" {
//   const value: any;
//   export default value;
// }

//est connection to db
fs.readFile('eventScrapeDate.json', (err, data) => {
  if (err) {
    throw err
  }
  console.log(data.toString())
})