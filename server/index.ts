import express, { Request, Response, Router } from "express";
import path from "path";
import { db } from "./db";
import dotenv from "dotenv";

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
app.use("/", routeHandler);

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
