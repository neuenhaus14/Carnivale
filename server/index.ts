import express, { Request, Response, Router } from "express";
import path from "path";
import { db, Join_shared_post, User } from "./db";
import dotenv from "dotenv";
import Pins from '../server/routes/Pins';
import FriendsRoutes from './routes/Friends'
import WeatherRouter from "./routes/WeatherApi";
import EventsRoutes from './routes/Events'

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
app.use('/api/friends', FriendsRoutes)
app.unsubscribe('/api/events', EventsRoutes)
app.use('/weather', WeatherRouter)
app.use("/", routeHandler);
app.use('/api/pins', Pins)

app.get("/api/shared-posts/:user_id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    const sharedPosts = await Join_shared_post.findAll({
      where: { recipient_userId: userId },
    });
    res.json(sharedPosts);
  } catch (error) {
    console.error("Error getting shared posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/user/:user_id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findByPk(userId);
    res.json(user);
  } catch (error) {
    console.error("Error getting user information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
