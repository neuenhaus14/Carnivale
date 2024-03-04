import express, { Request, Response, Router } from "express";
import path from "path";
import "./db"; //importing not using. so it does the same thing
import "./db/mongoAtlas" // same as above to spin up mongoConnection
import { auth } from "express-openid-connect";
import { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, ISSUER, REDIRECT_URL } from "./config";
import { Server } from "socket.io";
// import { Model } from "sequelize";
import PinRoutes from "./routes/Pins";
import http from "http";
import cors from "cors";
//import Upload  from "./routes/PhotoUpload"
// import cloudinary from "./utils/cloudinary_helpers"; //grabbing reference to an already configured cloudinary object
import FriendsRoutes from "./routes/Friends";
import WeatherRoutes from "./routes/WeatherApi";
import WeatherForecastRoutes from "./routes/WeatherForecast";
import EventsRoutes from "./routes/Events";
import HomeRoutes from "./routes/Home";
import FeedRoutes from "./routes/Feed";
import ImageRouter from "./routes/PhotoUpload";
import ParadesRoutes from "./routes/Parades";
import GigsRoutes from "./routes/ScrapeEvents";
import MailListRoutes from "./routes/MailList"
import { User, } from "./db/index";

// import { Sequelize } from "sequelize";
// import { Socket } from "dgram";
//start()
//this is declaring db as an obj so it can be ran when server starts
//this is running db/index.ts

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 4000;

const routeHandler = Router();
const distPath = path.resolve(__dirname, "..", "dist");
const imgPath = path.resolve(__dirname, "..", "img");

app.use(express.static(distPath));
app.use("/img", express.static(imgPath));
app.use(express.json());

app.use("/api/home", HomeRoutes);
app.use("/api/friends", FriendsRoutes);
app.use("/api/events", EventsRoutes);
app.use("/api/weather", WeatherRoutes);
app.use("/api/weather/forecast", WeatherForecastRoutes);
app.use("/", routeHandler);
app.use("/api/pins", PinRoutes);
app.use("/api/feed", FeedRoutes);
app.use("/api/images", ImageRouter);
app.use("/api/parades", ParadesRoutes);
app.use("/api/gigs", GigsRoutes);
app.use("/api/mail", MailListRoutes)
app.use(
  cors({
    origin: ["http://localhost:4000"],
    credentials: true,
  })
);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: AUTH0_CLIENT_SECRET,
  baseURL: REDIRECT_URL,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: ISSUER,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/auth", (req, res) => {
  res.render("index", { isAuthenticated: req.oidc.isAuthenticated() });
});

app.patch('/userLoc', (req, res) => {
  const {longitude, latitude, id} = req.body

  User.update({longitude, latitude}, {where: {id}})
  .then(() => {
    res.sendStatus(200)
  })
  .catch((err) => console.error(err))
})


io.on('connection', (socket: any) => {
   console.log('a user connected');

  socket.on('userLoc', (userLoc: any) => {

       io.emit('userLoc response', userLoc)
       //socket.broadcast.emit('userLoc response', userLoc)
  });


  socket.on("disconnect", () => {
     console.log("a user disconnected");
  });
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

// this inits the type for req/res for typescript
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

export default server;