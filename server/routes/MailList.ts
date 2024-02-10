import { Router, Request, Response } from "express";
import { mailListSubscriber } from "../db/mongoAtlas";
const MailList = Router();

MailList.post("/addToMailList", async (req: Request, res: Response) => {
  try {
    const recipient = req.body
    await mailListSubscriber.create(recipient);
    res.status(200).send("NICE!")
  } catch (err) {
    console.error("SERVER ERROR: failed to add to mail list", err)
  }
})


export default MailList