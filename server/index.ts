import express, { Request, Response, Router } from "express";
import path from "path";
import { db } from "./db";
import { auth, requiresAuth } from 'express-openid-connect';
import { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, ISSUER } from './config';
import PinRoutes from './routes/Pins';
//import Upload  from "./routes/PhotoUpload"
import cloudinary  from "./utils/cloudinary_helpers" //grabbing reference to an already configured cloudinary object
import FriendsRoutes from './routes/Friends'
import WeatherRoutes from "./routes/WeatherApi";
import EventsRoutes from './routes/Events'
import HomeRoutes from "./routes/Home";
import FeedRoutes from "./routes/Feed";
import ImageRouter from './routes/PhotoUpload'

//this is declaring db as an obj so it can be ran when server starts
type db = { db: object };
//this is running db/index.ts
db;

const app = express();
const port = 4000;

const routeHandler = Router();
const distPath = path.resolve(__dirname, "..", "dist");

app.use(express.static(distPath));
app.use(express.json());

app.use('/api/home', HomeRoutes)
app.use('/api/friends', FriendsRoutes)
app.use("/api/events", EventsRoutes);
app.use('/api/weather', WeatherRoutes)
app.use("/", routeHandler);
app.use("/api/pins", PinRoutes);
app.use("/api/feed", FeedRoutes);
app.use('/api/images', ImageRouter)

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: AUTH0_CLIENT_SECRET,
  baseURL: 'http://localhost:4000',
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: ISSUER
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/auth', (req, res) => {
  console.log(req.oidc.isAuthenticated());
  res.render("index", {isAuthenticated: req.oidc.isAuthenticated()});
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

// this inits the type for req/res for typescript
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


