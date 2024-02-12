import { Router, Request, Response } from "express";
import { mailListSubscriber } from "../db/mongoAtlas";
const MailList = Router();

MailList.post("/addToMailList", async (req: Request, res: Response) => {
  try {
    const {email} = req.body
    console.log('inside addToMailList',email)
    await mailListSubscriber.create({email: email});
    res.status(200).send("NICE!")
  } catch (err) {
    console.error("SERVER ERROR: failed to add to mail list", err)
  }
})


export default MailList