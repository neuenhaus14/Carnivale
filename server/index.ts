import express, { Request, Response, Router } from "express";
import path from "path";
import "./db"; //importing not using. so it does the same thing
import { auth, requiresAuth } from 'express-openid-connect';
import { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, ISSUER } from './config';
import { Server } from 'socket.io';
import PinRoutes from './routes/Pins';
import http from 'http'
import cors from 'cors'
//import Upload  from "./routes/PhotoUpload"
import cloudinary from "./utils/cloudinary_helpers"; //grabbing reference to an already configured cloudinary object
import FriendsRoutes from "./routes/Friends";
import WeatherRoutes from "./routes/WeatherApi";
import EventsRoutes from "./routes/Events";
import HomeRoutes from "./routes/Home";
import FeedRoutes from "./routes/Feed";
import ImageRouter from "./routes/PhotoUpload";
import ParadesRoutes from "./routes/Parades";
import GigsRoutes from "./routes/ScrapeEvents";
import { User } from './db/index'
import { Sequelize } from "sequelize";
//start()
//this is declaring db as an obj so it can be ran when server starts
//this is running db/index.ts


const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: '*'}})
const port = 4000;

const routeHandler = Router();
const distPath = path.resolve(__dirname, "..", "dist");
const imgPath = path.resolve(__dirname, "..", "img");

app.use(express.static(distPath));
app.use('/img', express.static(imgPath));
app.use(express.json());

app.use("/api/home", HomeRoutes);
app.use("/api/friends", FriendsRoutes);
app.use("/api/events", EventsRoutes);
app.use("/api/weather", WeatherRoutes);
app.use("/", routeHandler);
app.use("/api/pins", PinRoutes);
app.use("/api/feed", FeedRoutes);
app.use("/api/images", ImageRouter);
app.use("/api/parades", ParadesRoutes);
app.use("/api/gigs", GigsRoutes)
app.use(cors({
  origin: ['http://localhost:4000'], 
  credentials: true
}));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: AUTH0_CLIENT_SECRET,
  baseURL: "http://localhost:4000",
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: ISSUER,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/auth", (req, res) => {
  console.log(req.oidc.isAuthenticated());
  res.render("index", { isAuthenticated: req.oidc.isAuthenticated() });
});

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('userLoc', (userLoc: any) => {
    console.log('userLoc', userLoc.longitude, userLoc.latitude, userLoc.id)
      User.update({longitude: userLoc.longitude, latitude: userLoc.latitude}, {where: {id: userLoc.id}})
      .then(() => {
        console.log('successfully updated location')}
        // User.findOne({where: {id: userLoc.id}})
        //   .then((data) => {
        //     io.emit('userLoc', data.dataValues)
        //   })
      )
      .catch((err) => console.error(err))
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected');
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


// SERVER CONNECTION
server.listen(port, () => {
  console.log(`
  Listening at: http://127.0.0.1:${port}
  `);
});

// this inits the type for req/res for typescript
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
