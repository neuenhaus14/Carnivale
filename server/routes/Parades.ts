import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";

const Parades = express.Router();

const paradeList = [
  "krewe-of-joan-of-arc",
  "societe-des-champs-elysee",
  "phunny-phorty-phellows",
  "funky-uptown-krewe",
  "fools-of-misrule",
  "mande-milkshakers",
  "krewe-of-chewbacchus",
  "krewe-boheme",
  "krewe-of-titans",
  "krewe-du-vieux",
  "krewe-of-bilge",
  "krewe-of-poseidon",
  "krewedelusion",
  "krewe-of-antheia",
  "tit-rex",
  "krewe-of-pearl-river-lions-club",
  "nefertiti",
  "krewe-of-cork",
  "krewe-of-excalibur",
  "krewe-of-oshun",
  "krewe-of-cleopatra",
  "krewe-of-alla",
  "krewe-of-eve",
  "magical-krewe-of-madhatters",
  "krewe-of-pontchartrain",
  "legion-of-mars",
  "krewe-of-choctaw",
  "krewe-of-freret",
  "knights-of-sparta",
  "krewe-of-pygmalion",
  "krewe-de-paws-of-olde-towne",
  "krewe-of-tchefuncte",
  "krewe-of-push-mow",
  "krewe-of-barkus",
  "krewe-of-atlas",
  "krewe-of-caerus",
  "mystic-krewe-of-femme-fatale",
  "krewe-of-carrollton",
  "krewe-of-king-arthur",
  "krewe-of-dionysus",
  "krewe-of-music",
  "tcqno",
  "krewe-of-druids",
  "krewe-of-nyx",
  "krewe-of-nandi",
  "krewe-of-symphony",
  "knights-of-babylon",
  "knights-of-chaos",
  "krewe-of-muses",
  "krewe-of-bosom-buddies",
  "krewe-of-hermes",
  "krewe-detat",
  "krewe-of-morpheus",
  "krewe-of-selene",
  "krewe-of-iris",
  "krewe-of-tucks",
  "krewe-of-nomtoc",
  "krewe-of-endymion",
  "krewe-of-athena",
  "krewe-of-okeanos",
  "krewe-of-mid-city",
  "krewe-of-thoth",
  "krewe-of-bacchus",
  "krewe-of-centurions",
  "krewe-of-proteus",
  "krewe-of-orpheus",
  "krewe-of-argus",
  "krewe-of-elks-jefferson",
  "krewe-of-zulu",
  "krewe-of-rex",
  "krewe-of-elks-orleans",
  "krewe-of-crescent-city",
  "carnival-in-covington",
  "krewe-of-folsom",
  "pooch",
  "mardi-paws",
];

const scrapeParadeInfo = async (paradeName: string) => {
  const url = `https://www.mardigrasneworleans.com/parades/${paradeName}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $("h1").text().trim();
    const description = $('meta[name="description"]').attr("content") || "";

    return { title, description };
  } catch (error) {
    throw new Error(
      `Error scraping parade info for ${paradeName}: ${error.message}`
    );
  }
};

Parades.get("/parade-list", (req: Request, res: Response) => {
  res.json({ parades: paradeList });
});

Parades.get("/parade-info/:paradeName", async (req: Request, res: Response) => {
  const { paradeName } = req.params;

  try {
    const info = await scrapeParadeInfo(paradeName);
    res.json(info);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default Parades;
