import express, { Request, Response, Router } from "express";
import path from "path";
import { db, Join_shared_post, User } from "./db";
import dotenv from "dotenv";
import Pins from "../server/routes/Pins";
import FriendsRoutes from "./routes/Friends";
import WeatherRouter from "./routes/WeatherApi";
import EventsRoutes from "./routes/Events";
import FeedRoutes from "./routes/Feed";

//this is declaring db as an obj so it can be ran when server starts
type db = { db: object };
//this is running db/index.ts
db;
dotenv.config();

const app = express();
const port = 4000;

const routeHandler = Router();
const distPath = path.resolve(__dirname, "..", "dist");

app.use(express.static(distPath));
app.use(express.json());
app.use("/api/friends", FriendsRoutes);
app.use("/api/events", EventsRoutes);
app.use("/weather", WeatherRouter);
app.use("/", routeHandler);
app.use("/api/pins", Pins);
app.use("/api/feed", FeedRoutes);

app.get("/*", function (req: Request, res: Response) {
  res.sendFile(
    path.join(__dirname, "..", "dist", "index.html"),
    function (err: Error) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});
// SERVER CONNECTION
app.listen(port, () => {
  console.log(`
  Listening at: http://127.0.0.1:${port}
  `);
});
