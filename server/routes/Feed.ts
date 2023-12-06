import express, { Request, Response } from "express";
import { Join_shared_post, User, Photo, Comment, Pin } from "../db";

const feedRouter = express.Router();

feedRouter.get(
  "/shared-posts/:user_id",
  async (req: Request, res: Response) => {
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
  }
);

feedRouter.get("/user/:user_id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findByPk(userId);
    res.json(user);
  } catch (error) {
    console.error("Error getting user information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

feedRouter.get(
  "/shared-photo/:photo_id",
  async (req: Request, res: Response) => {
    try {
      const photoId = req.params.photo_id;
      const sharedPhoto = await Photo.findByPk(photoId);
      res.json(sharedPhoto);
    } catch (error) {
      console.error("Error getting shared photo information:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.get(
  "/shared-comment/:comment_id",
  async (req: Request, res: Response) => {
    try {
      const commentId = req.params.comment_id;
      const sharedComment = await Comment.findByPk(commentId);
      res.json(sharedComment);
    } catch (error) {
      console.error("Error getting shared comment information:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

feedRouter.get("/shared-pin/:pin_id", async (req: Request, res: Response) => {
  try {
    const pinId = req.params.pin_id;
    const sharedPin = await Pin.findByPk(pinId);
    res.json(sharedPin);
  } catch (error) {
    console.error("Error getting shared pin information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default feedRouter;
